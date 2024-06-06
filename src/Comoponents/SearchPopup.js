import ReactDOM from 'react-dom';
import '../Styling/SearchPopup.css';
import React, { useState, useEffect } from "react";
import axios from "axios";
import debounce from 'lodash/debounce';

function SearchPopup({ team1, team2, setPlayerName, onclose }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [players, setPlayers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        const debouncedFetchPlayers = debounce(async (query) => {
            try {
                setLoading(true);
                const response = await axios.get('https://cricketbackend-kmwq.onrender.com/api/player_list/', {
                    headers: {
                        'Player-Name': query
                    }
                });
                setPlayers(response.data.players); // Show all players
                setLoading(false);
            } catch (error) {
                console.error('Error fetching players:', error);
                setPlayers([]);
                setLoading(false);
            }
        }, 500);

        if (searchQuery.trim() !== '') {
            debouncedFetchPlayers(searchQuery.trim());
        } else {
            setPlayers([]);
        }

        // Clean up function to cancel pending requests if component unmounts
        return () => debouncedFetchPlayers.cancel();
    }, [searchQuery]);

    const handleInputChange = (event) => {
        const query = event.target.value;
        setSearchQuery(query);
    };

    const handlePlayerClick = async (player) => {
        try {
            const response = await axios.get('https://cricketbackend-kmwq.onrender.com/api/check-player-teams/', {
                headers: {
                    'Player-ID': player.player_id, // Assuming player object contains id
                    'Team-ID-1': team1,
                    'Team-ID-2': team2
                }
            });

            if (response.status === 200) {
                setPlayerName(player.player_name); // Set the selected player name
                onclose(); // Close the popup
            }
        } catch (error) {
            setErrorMessage('Player not found. Please select a correct player.');
            setTimeout(() => {
                setErrorMessage(''); // Hide the alert after a short duration
            }, 1000); // 1 second duration
            console.error('Error checking player:', error);
        }
    };

    return ReactDOM.createPortal(
        <div className="popup-container">
            <div className="popup-content">
                <button className="close-button" onClick={onclose}>x</button>
                {errorMessage && <div className="alert">{errorMessage}</div>}
                <input
                    type="text"
                    value={searchQuery}
                    onChange={handleInputChange}
                    placeholder="Search Player ..."
                />
                <div className="dropdown-content">
                    {loading ? <div>Loading...</div> : (
                        <ul className="player-list">
                            {players.map((player, index) => (
                                <li key={index} onClick={() => handlePlayerClick(player)}>
                                    {player.player_name}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>,
        document.getElementById('pop-up')
    );
}

export default SearchPopup;
