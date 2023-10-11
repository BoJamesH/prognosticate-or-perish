import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import './Navigation.css';

function Navigation({ isLoaded }){
	const sessionUser = useSelector(state => state.session.user);

	return (
		<ul className='nav-ul'>
			<li>
				<NavLink className='p-or-p-title' exact to="/">PROGNOSTICATE or PERISH</NavLink>
			</li>
			{sessionUser &&
				<li>
					<NavLink className='nav-user-profile' exact to="/user">My Profile</NavLink>
				</li>}
			{sessionUser &&
				<li>
					<NavLink className='nav-user-profile' exact to="/leaderboard">Leaderboard</NavLink>
				</li>}
			{sessionUser &&
				<li>
					<NavLink className='nav-user-profile' exact to="/">Games</NavLink>
				</li>}
			{isLoaded && (
				<li>
					<ProfileButton user={sessionUser} />
				</li>
			)}
		</ul>
	);
}

export default Navigation;
