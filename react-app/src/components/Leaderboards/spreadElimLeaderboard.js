import './leaderboards.css';

function SpreadEliminatorLeaderboard({ users }) {
  const sortedUsers = users.sort((a, b) => {
    // Sort by wins
    if (b.sp_elim_wins !== a.sp_elim_wins) {
      return b.sp_elim_wins - a.sp_elim_wins;
    }
    // If wins are the same, sort by losses
    if (a.sp_elim_losses !== b.sp_elim_losses) {
      return a.sp_elim_losses - b.sp_elim_losses;
    }
    // If both wins and losses are the same, sort alphabetically by username
    return a.username.localeCompare(b.username);
  });

  let rank = 1;
  let prevUser = sortedUsers[0];

  const usersWithRanks = sortedUsers.map((user, index) => {
    if (user.sp_elim_wins !== prevUser.sp_elim_wins || user.sp_elim_losses !== prevUser.sp_elim_losses) {
      rank++;
    }
    prevUser = user;
    return { ...user, rank };
  });

  return (
    <div className="leaderboard">
      <h2 className='leaderboard-title'>Spread Eliminator Leaderboard</h2>
      <table>
        <thead>
          <tr>
            <th className='leaderboard-header'>Rank</th>
            <th className='leaderboard-username leaderboard-header'>Username</th>
            <th className='leaderboard-header'>Wins</th>
            <th className='leaderboard-header'>Losses</th>
            <th className='leaderboard-header'>Pushes</th>
          </tr>
        </thead>
        <tbody>
          {usersWithRanks.map((user) => (
            <tr key={user.id}>
              <td>{user.rank}</td>
              <td>{user.username}</td>
              <td>{user.sp_elim_wins}</td>
              <td>{user.sp_elim_losses}</td>
              <td>{user.sp_elim_pushes}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default SpreadEliminatorLeaderboard;
