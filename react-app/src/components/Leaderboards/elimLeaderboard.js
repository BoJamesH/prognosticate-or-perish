import './leaderboards.css';

function EliminatorLeaderboard({ users }) {
  const sortedUsers = users.sort((a, b) => {
    // Sort by wins
    if (b.elim_wins !== a.elim_wins) {
      return b.elim_wins - a.elim_wins;
    }
    // If wins are the same, sort by losses
    if (a.elim_losses !== b.elim_losses) {
      return a.elim_losses - b.elim_losses;
    }
    // If both wins and losses are the same, sort alphabetically by username
    return a.username.localeCompare(b.username);
  });

  let rank = 1;
  let prevUser = sortedUsers[0];

  const usersWithRanks = sortedUsers.map((user, index) => {
    if (user.elim_wins !== prevUser.elim_wins || user.elim_losses !== prevUser.elim_losses) {
      rank++;
    }
    prevUser = user;
    return { ...user, rank };
  });

  return (
    <div className="leaderboard">
      <h2 className='leaderboard-title'>Eliminator Leaderboard</h2>
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
          {usersWithRanks.map((user) => (
            <tr key={user.id}>
              <td>{user.rank}</td>
              <td>{user.username}</td>
              <td>{user.elim_wins}</td>
              <td>{user.elim_losses}</td>
              <td>{user.elim_ties}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default EliminatorLeaderboard;

