// import './leaderboards.css';

// function Leaderboard({ users, gameType, coins }) {
//   const sortedUsers = users.sort((a, b) => b[coins] - a[coins]);

//   let rank = 1;
//   let prevUser = sortedUsers[0];

//   const usersWithRanks = sortedUsers.map((user, index) => {
//     if (user[coins] !== prevUser[coins]) {
//       rank++;
//     }
//     prevUser = user;
//     return { ...user, rank };
//   });

//   return (
//     <div className="leaderboard">
//       <h2 className='leaderboard-title'>{gameType === 'elim' ? `Eliminator` : `Pick 'Em`} Leaderboard</h2>
//       <table>
//         <thead>
//           <tr>
//             <th className='leaderboard-header'>Rank</th>
//             <th className='leaderboard-username leaderboard-header'>Username</th>
//             <th className='leaderboard-header'>Wins</th>
//             <th className='leaderboard-header'>Losses</th>
//             <th className='leaderboard-header'>Ties</th>
//           </tr>
//         </thead>
//         <tbody>
//           {usersWithRanks.map((user) => (
//             <tr key={user.id}>
//               <td>{user.rank}</td>
//               <td>{user.username}</td>
//               <td>{user[`${gameType}_wins`]}</td>
//               <td>{user[`${gameType}_losses`]}</td>
//               <td>{user[`${gameType}_ties`]}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// }

// export default Leaderboard;
