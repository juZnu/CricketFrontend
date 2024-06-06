import axios from "axios";
import {useEffect, useState} from "react";
import SearchPopup from "./SearchPopup";

function Box({team_1, team_2, reveal}) {
    const [playerName, setPlayerName] = useState(null);
    const [openPopup, setOpenPopup] = useState(false);

    const getPlayer = async () => {
        try {
            const response = await axios.get('https://cricketbackend-kmwq.onrender.com/api/get-player-played-for-both-teams/', {
                headers: {
                    'Team-ID-1': team_1,
                    'Team-ID-2': team_2,
                }
            });
            return response.data.player_name;
        } catch (error) {
            console.error(`Error fetching player for teams ${team_1} and ${team_2}:`, error);
            return null;
        }
    };

    useEffect(() => {
        if (reveal && !playerName) {
            getPlayer().then((name) => {
                setPlayerName(name);
            });
        }
    }, [reveal]);

    return(
        <>
            {playerName ? (
                <div>{playerName}</div>
            ) : (
                <div>
                    <button onClick={() => setOpenPopup(true)}>+</button>
                    {openPopup && (
                        <SearchPopup
                            team1={team_1}
                            team2={team_2}
                            setPlayerName={setPlayerName}
                            onclose={() => setOpenPopup(false)}
                        />
                    )}
                </div>
            )}
        </>
    )
}

export default Box;
