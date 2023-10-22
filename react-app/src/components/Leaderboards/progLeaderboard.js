import './leaderboards.css';

function PrognosticoinLeaderboard({ users }) {
  const sortedUsers = users.sort((a, b) => b.prognosticoins - a.prognosticoins);

  let rank = 1;
  let prevUser = sortedUsers[0];

  const usersWithRanks = sortedUsers.map((user, index) => {
    if (user.prognosticoins !== prevUser.prognosticoins) {
      rank++;
    }
    prevUser = user;
    return { ...user, rank };
  });

  return (
    <div className="leaderboard">
      <h2 className='leaderboard-title'>Prognosticoin Leaderboard</h2>
      <table>
        <thead>
          <tr>
            <th className='leaderboard-header'>Rank</th>
            <th className='leaderboard-username leaderboard-header'>Username</th>
            <th className='leaderboard-header'>Prognosticoins</th>
          </tr>
        </thead>
        <tbody>
          {usersWithRanks.map((user) => (
            <tr key={user.id}>
              <td>{user.rank}</td>
              <td>{user.username}</td>
              <td>{user.prognosticoins}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default PrognosticoinLeaderboard;
