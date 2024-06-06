import React, { useEffect, useState } from 'react';
import axios from "axios";
import Box from "./Box";
import "../Styling/Board.css"; // Import the CSS file for Board component styles

function Board() {
    const [teams, setTeams] = useState({});
    const [loading, setLoading] = useState(true);
    const [reveal, setReveal] = useState(false);

    const getTeamName = async (team_id) => {
        try {
            const response = await axios.get('https://cricketbackend-kmwq.onrender.com/api/team/', {
                headers: {
                    'Team-ID': team_id
                }
            })
            return response.data;
        } catch (error) {
            console.error(`Error fetching team with ID ${team_id}:`, error);
            return null;
        }
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('https://cricketbackend-kmwq.onrender.com/api/teams-grid/')

                const { col_teams, row_teams } = response.data.grid;
                let col_team_names = await Promise.all(col_teams.map(team_id => getTeamName(team_id)));
                let row_team_names = await Promise.all(row_teams.map(team_id => getTeamName(team_id)));

                col_team_names = col_team_names.map(team => {
                    return {
                        id: team.team_id,
                        name: team.name,
                    }
                })

                row_team_names = row_team_names.map(team => {
                    return {
                        id: team.team_id,
                        name: team.name,
                    }
                })

                setTeams({ 'col_teams': col_team_names, 'row_teams': row_team_names });

                setLoading(false);

            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }

        fetchData();

    }, []);

    const onRevealPlayersClick = () => {
        setReveal(true);
    }

    const onRefreshGameClick = () => {
        setLoading(true); // Set loading state to true to display "Loading..." message
        setReveal(false); // Reset reveal state
        fetchData(); // Fetch new data
    }

    const fetchData = async () => {
        try {
            const response = await axios.get('https://cricketbackend-kmwq.onrender.com/api/teams-grid/')

            const { col_teams, row_teams } = response.data.grid;
            let col_team_names = await Promise.all(col_teams.map(team_id => getTeamName(team_id)));
            let row_team_names = await Promise.all(row_teams.map(team_id => getTeamName(team_id)));

            col_team_names = col_team_names.map(team => {
                return {
                    id: team.team_id,
                    name: team.name,
                }
            })

            row_team_names = row_team_names.map(team => {
                return {
                    id: team.team_id,
                    name: team.name,
                }
            })

            setTeams({ 'col_teams': col_team_names, 'row_teams': row_team_names });

            setLoading(false);

        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    return (
        <div className="box-container">
            <h1 className="title">CRICKET TIC TAC TOE</h1>
            {loading ? <div>Loading...</div> :
                <div>
                    <div className="button-container">
                        <button className="reveal-button" onClick={onRefreshGameClick}>Refresh Game</button>
                        {reveal ? <></> :
                            <button className="reveal-button" onClick={onRevealPlayersClick}>Reveal Players</button>}

                    </div>
                    <div className="box-row">
                        <div className="box-content">Game</div>
                        {
                            teams.col_teams.map(team => (
                                <div key={team.id} className="box-content">{team.name}</div>
                            ))
                        }
                    </div>
                    {
                        teams.row_teams.map(team1 => (
                            <div key={team1.name} className="box-row">
                                <div key={team1.id} className="box-content">{team1.name}</div>
                                {
                                    teams['col_teams'].map(team2 => (
                                        <div key={`${team1.id} ${team2.id}`} className="box-content">
                                            <Box team_1={team1.id} team_2={team2.id} reveal={reveal} />
                                        </div>
                                    ))
                                }
                            </div>
                        ))
                    }
                </div>
            }

        </div>
    )
}

export default Board;
