import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Axios from 'axios';
import { useImmerReducer } from 'use-immer';

// Assets
import defaultProfilePicture from './Assets/defaultProfilePicture.jpg';

// MUI
import {
    Grid,
    Typography,
    Button,
    Card,
    CardContent,
    CardMedia,
    CircularProgress,
    CardActions,
} from '@mui/material';


function Agencies() {
    const navigate = useNavigate();

    const initialState = {
        dataIsLoading: true,
        agenciesList: [],
    };

    function ReducerFuction(draft, action) {
        switch (action.type) {
            case 'catchAgencies':
                draft.agenciesList = action.agenciesArray;
                break;

            case 'loadingDone':
                draft.dataIsLoading = false;
                break;
        }
    }

    const [state, dispatch] = useImmerReducer(ReducerFuction, initialState);

    useEffect(() => {
        async function GetAgencies() {
            try {
                const response = await Axios.get(
                    `https://homehome-backend.herokuapp.com/api/profiles/`
                );

                dispatch({
                    type: 'catchAgencies',
                    agenciesArray: response.data,
                });
                dispatch({ type: 'loadingDone' });
            } catch (e) {}
        }
        GetAgencies();
    }, []);

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
        <Grid
            container
            justifyContent='flex-start'
            spacing={2}
            style={{ padding: '1rem', backgroundColor: '#EFF1F3' }}
            height='100vh'
        >
            {state.agenciesList.map((agency) => {
                function PropertiesDisplay() {
                    if (agency.seller_listings.length === 0) {
                        return (
                            <Button disabled size='small'>
                                No Property
                            </Button>
                        );
                    } else if (agency.seller_listings.length === 1) {
                        return (
                            <Button
                                size='small'
                                onClick={() =>
                                    navigate(`/agencies/${agency.seller}`)
                                }
                                style={{backgroundColor:'#223c50', color: '#fff'}}
                            >
                                One Property listed
                            </Button>
                        );
                    } else {
                        return (
                            <Button
                                size='small'
                                onClick={() =>
                                    navigate(`/agencies/${agency.seller}`)
                                }
                            >
                                {agency.seller_listings.length} Properties
                            </Button>
                        );
                    }
                }

                if (agency.agency_name && agency.phone_number)
                    return (
                        <Grid
                            key={agency.id}
                            item
                            style={{ marginTop: '1rem', maxWidth: '20rem' }}
                        >
                            <Card>
                                <CardMedia
                                    component='img'
                                    height='140'
                                    image={
                                        agency.profile_picture
                                            ? agency.profile_picture
                                            : defaultProfilePicture
                                    }
                                    alt='Profile Picture'
                                />
                                <CardContent>
                                    <h2
                                    >
                                        {agency.agency_name}
                                    </h2>
                                    <p
                                    >
                                        {agency.bio.substring(0, 100)}...
                                    </p>
                                </CardContent>
                                <CardActions style={{margin: 'auto'}}>{PropertiesDisplay()}</CardActions>
                            </Card>
                        </Grid>
                    );
            })}
        </Grid>
    );
}

export default Agencies;
