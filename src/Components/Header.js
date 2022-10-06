import React, { useState, useContext, useEffect } from 'react';
import Axios from 'axios';
import { useNavigate } from 'react-router-dom';

import { Button, Fade, Menu, MenuItem, Snackbar } from '@mui/material';

import StateContext from '../Contexts/StateContext';
import DispatchContext from '../Contexts/DispatchContext';

import './styles.css';

function Header() {
    const navigate = useNavigate();
    const GlobalState = useContext(StateContext);
    const GlobalDispatch = useContext(DispatchContext);

    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    function HandleProfile() {
        setAnchorEl(null);
        navigate('/profile');
    }

    const [openSnack, setOpenSnack] = useState(false);

    async function HandleLogout() {
        setAnchorEl(null);
        const confirmLogout = window.confirm('Are you sure you want to leave?');
        if (confirmLogout) {
            try {
                const response = await Axios.post(
                    'https://homehome-backend.herokuapp.com/api-auth-djoser/token/logout/',
                    GlobalState.userToken,
                    {
                        headers: {
                            Authorization: 'Token '.concat(
                                GlobalState.userToken
                            ),
                        },
                    }
                );

                GlobalDispatch({ type: 'logout' });
                setOpenSnack(true);
            } catch (e) {}
        }
    }

    useEffect(() => {
        if (openSnack) {
            setTimeout(() => {
                navigate(0);
            }, 1500);
        }
    }, [openSnack]);

    return (
        <header position='static' class='header'>
            <div class='header-left'>
                <button class='header-name' onClick={() => navigate('/')}>
                    Home Planner
                </button>
            </div>
            <div class='header-middle'>
                <button
                    class='nav-middle-btn'
                    color='inherit'
                    onClick={() => navigate('/listings')}
                >
                    Listings
                </button>
                <button
                    class='nav-middle-btn'
                    color='inherit'
                    onClick={() => navigate('/agencies')}
                >
                    Agencies
                </button>
                <button
                    class='nav-middle-btn'
                    id='add-property'
                    onClick={() => navigate('/addproperty')}
                >
                    Add Property
                </button>
            </div>
            <div class='header-right'>
                {GlobalState.userIsLogged ? (
                    <>
                        <Button
                            id='fade-button'
                            aria-controls={open ? 'fade-menu' : undefined}
                            aria-haspopup='true'
                            aria-expanded={open ? 'true' : undefined}
                            onClick={handleClick}
                            style={{
                                color: 'white',
                                fontFamily: 'Franklin Gothic Medium',
                                fontSize: '1rem',
                                marginLeft: '30vh',
                            }}
                        >
                            {GlobalState.userUsername}
                        </Button>
                        <Menu
                            id='fade-menu'
                            MenuListProps={{
                                'aria-labelledby': 'fade-button',
                            }}
                            anchorEl={anchorEl}
                            open={open}
                            onClose={handleClose}
                            TransitionComponent={Fade}
                            style={{
                                color: 'white',
                                backgroundColor: '#223c50',
                                fontFamily: "'Montserrat', sans-serif",
                                fontSize: '1rem',
                            }}
                        >
                            <MenuItem onClick={HandleProfile}>Profile</MenuItem>
                            <MenuItem onClick={HandleLogout}>Logout</MenuItem>
                        </Menu>
                        <Snackbar
                            open={openSnack}
                            message='You have successfully logged out!'
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'center',
                            }}
                        />
                    </>
                ) : (
                    <Button
                        id='fade-button'
                        aria-controls={open ? 'fade-menu' : undefined}
                        aria-haspopup='true'
                        aria-expanded={open ? 'true' : undefined}
                        onClick={() => navigate('/login')}
                        style={{
                            color: 'white',
                            backgroundColor: '#223c50',
                            fontFamily: "'Montserrat', sans-serif",
                            fontSize: '1rem',
                        }}
                    >
                        Login
                    </Button>
                )}
            </div>
        </header>
    );
}

export default Header;
