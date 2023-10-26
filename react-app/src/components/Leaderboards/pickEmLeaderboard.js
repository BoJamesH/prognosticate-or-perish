import './leaderboards.css';

function PickEmLeaderboard({ users }) {
  const sortedUsers = users.sort((a, b) => {
    if (b.pick_wins !== a.pick_wins) {
      return b.pick_wins - a.pick_wins;
    }
    if (a.pick_losses !== b.pick_losses) {
      return a.pick_losses - b.pick_losses;
    }
    return a.username.localeCompare(b.username);
  });

  let rank = 1;
  let prevUser = sortedUsers[0];

  const usersWithRanks = sortedUsers.map((user, index) => {
    if (user.pick_wins !== prevUser.pick_wins || user.pick_losses !== prevUser.pick_losses) {
      rank++;
    }
    prevUser = user;
    return { ...user, rank };
  });

  return (
    <div className="leaderboard">
      <h2 className='leaderboard-title'>Pick 'Em Leaderboard</h2>
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
              <td>{user.pick_wins}</td>
              <td>{user.pick_losses}</td>
              <td>{user.pick_ties}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default PickEmLeaderboard;
