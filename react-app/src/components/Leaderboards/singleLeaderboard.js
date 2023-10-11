import './leaderboards.css'

function Leaderboard({ users, gameType }) {

    const sortedUsers = users.sort((a, b) => {
      if (a[`${gameType}_wins`] !== b[`${gameType}_wins`]) {
        return b[`${gameType}_wins`] - a[`${gameType}_wins`];
      } else if (a[`${gameType}_losses`] !== b[`${gameType}_losses`]) {
        return a[`${gameType}_losses`] - b[`${gameType}_losses`];
      } else {
        return Math.random() - 0.5;
      }
    });

    return (
        <div className="leaderboard">
            <h2 className='leaderboard-title'>{gameType === 'elim' ? `Eliminator` : `Pick 'Em`} Leaderboard</h2>
            <table>
                <thead>
                    <tr>
                        <th className='leaderboard-header'>Rank</th>
                        <th className='leaderboard-username leaderboard-header'>Username</th>
                        <th className='leaderboard-header'>Wins</th>
                        <th className='leaderboard-header'>Losses</th>
                        <th className='leaderboard-header'>Ties</th>
                    </tr>
                </thead>
                <tbody>
                {sortedUsers.map((user, index) => (
                <tr key={user.id}>
                    <td>{index + 1}</td>
                    <td>{user.username}</td>
                    <td>{user[`${gameType}_wins`]}</td>
                    <td>{user[`${gameType}_losses`]}</td>
                    <td>{user[`${gameType}_ties`]}</td>
                </tr>
                ))}
                </tbody>
            </table>
      </div>
    );
  }

  export default Leaderboard;
