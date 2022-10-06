import React, { useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Axios from 'axios';
import { useImmerReducer } from 'use-immer';

// Contexts
import StateContext from '../Contexts/StateContext';

// Assets
import defaultProfilePicture from './Assets/defaultProfilePicture.jpg';

// Components
import ProfileUpdate from './ProfileUpdate';

// MUI
import { Grid, Typography, Button, CircularProgress } from '@mui/material';

function Profile() {
    const navigate = useNavigate();
    const GlobalState = useContext(StateContext);

    const initialState = {
        userProfile: {
            agencyName: '',
            phoneNumber: '',
            profilePic: '',
            bio: '',
            sellerId: '',
            sellerListings: [],
        },
        dataIsLoading: true,
    };

    function ReducerFuction(draft, action) {
        switch (action.type) {
            case 'catchUserProfileInfo':
                draft.userProfile.agencyName = action.profileObject.agency_name;
                draft.userProfile.phoneNumber =
                    action.profileObject.phone_number;
                draft.userProfile.profilePic =
                    action.profileObject.profile_picture;
                draft.userProfile.bio = action.profileObject.bio;
                draft.userProfile.sellerListings =
                    action.profileObject.seller_listings;
                draft.userProfile.sellerId = action.profileObject.seller;
                break;

            case 'loadingDone':
                draft.dataIsLoading = false;
                break;
        }
    }

    const [state, dispatch] = useImmerReducer(ReducerFuction, initialState);

    // request to get profile info
    useEffect(() => {
        async function GetProfileInfo() {
            try {
                const response = await Axios.get(
                    `https://homehome-backend.herokuapp.com/api/profiles/${GlobalState.userId}/`
                );

                dispatch({
                    type: 'catchUserProfileInfo',
                    profileObject: response.data,
                });
                dispatch({ type: 'loadingDone' });
            } catch (e) {}
        }
        GetProfileInfo();
    }, []);

    function PropertiesDisplay() {
        if (state.userProfile.sellerListings.length === 0) {
            return (
                <Button
                    style={{ fontfamily: "'Merriweather', serif" }}
                    onClick={() =>
                        navigate(`/agencies/${state.userProfile.sellerId}`)
                    }
                    disabled
                    size='small'
                >
                    No Property
                </Button>
            );
        } else if (state.userProfile.sellerListings.length === 1) {
            return (
                <Button
                    style={{ fontfamily: "'Merriweather', serif" }}
                    onClick={() =>
                        navigate(`/agencies/${state.userProfile.sellerId}`)
                    }
                    size='small'
                >
                    One Property listed
                </Button>
            );
        } else {
            return (
                <Button
                    style={{ fontfamily: "'Merriweather', serif" }}
                    onClick={() =>
                        navigate(`/agencies/${state.userProfile.sellerId}`)
                    }
                    size='small'
                >
                    {state.userProfile.sellerListings.length} Properties
                </Button>
            );
        }
    }

    function WelcomeDisplay() {
        if (
            state.userProfile.agencyName === null ||
            state.userProfile.agencyName === '' ||
            state.userProfile.phoneNumber === null ||
            state.userProfile.phoneNumber === ''
        ) {
            return (
                <Typography
                    variant='h5'
                    style={{ textAlign: 'center', marginTop: '1rem' }}
                >
                    Welcome{' '}
                    <span style={{ color: 'green', fontWeight: 'bolder' }}>
                        {GlobalState.userUsername}
                    </span>{' '}
                    , please submit this form below to update your profile.
                </Typography>
            );
        } else {
            return (
                <div
                    style={{
                        display: 'flex',
                        padding: '3rem 10rem 2rem 10rem',
                    }}
                >
                    <div
                        style={{
                            width: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-around',
                        }}
                    >
                        <div>
                            <h1>
                                Welcome{' '}
                                <span
                                    style={{
                                        fontWeight: 'bolder',
                                    }}
                                >
                                    {GlobalState.userUsername}!
                                </span>
                            </h1>
                        </div>
                        <div>
                            <h5>You have {PropertiesDisplay()}</h5>
                        </div>
                    </div>
                    <div>
                        <img
                            style={{
                                height: '10rem',
                                width: '10rem',
                                objectFit: 'cover',
                                borderRadius: '10%',
                            }}
                            src={
                                state.userProfile.profilePic !== null
                                    ? state.userProfile.profilePic
                                    : defaultProfilePicture
                            }
                            alt='profile picture'
                        />
                    </div>
                </div>
            );
        }
    }

    if (state.dataIsLoading === true) {
        return (
            <Grid
                container
                justifyContent='center'
                alignItems='center'
                style={{ height: '100vh' }}
            >
                <CircularProgress />
            </Grid>
        );
    }

    return (
        <div style={{ backgroundColor: '#eff1f3' }}>
            <div>{WelcomeDisplay()}</div>
            <hr style={{ width: '90%', margin: 'auto' }} />
            <ProfileUpdate userProfile={state.userProfile} />
        </div>
    );
}

export default Profile;
