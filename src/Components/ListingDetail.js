import React, { useEffect, useState, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Axios from 'axios';
import { useImmerReducer } from 'use-immer';

// Contexts
import StateContext from '../Contexts/StateContext';

// Assets
import defaultProfilePicture from './Assets/defaultProfilePicture.jpg';
import stadiumIconPng from './Assets/Mapicons/stadium.png';
import hospitalIconPng from './Assets/Mapicons/hospital.png';
import universityIconPng from './Assets/Mapicons/university.png';
import './styles.css';

// Components
import ListingUpdate from './ListingUpdate';

// React Leaflet
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Icon } from 'leaflet';

// MUI
import {
    ImageList,
    ImageListItem,
    Grid,
    Typography,
    Button,
    CircularProgress,
    IconButton,
    Breadcrumbs,
    Link,
    Dialog,
    Snackbar,
} from '@mui/material';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import PoolIcon from '@mui/icons-material/Pool';
import ElevatorIcon from '@mui/icons-material/Elevator';
import VideoCameraFrontIcon from '@mui/icons-material/VideoCameraFront';
import LocalParkingIcon from '@mui/icons-material/LocalParking';

function ListingDetail2() {
    const navigate = useNavigate();
    const GlobalState = useContext(StateContext);

    const params = useParams();

    const stadiumIcon = new Icon({
        iconUrl: stadiumIconPng,
        iconSize: [40, 40],
    });

    const hospitalIcon = new Icon({
        iconUrl: hospitalIconPng,
        iconSize: [40, 40],
    });

    const universityIcon = new Icon({
        iconUrl: universityIconPng,
        iconSize: [40, 40],
    });

    const initialState = {
        dataIsLoading: true,
        listingInfo: '',
        sellerProfileInfo: '',
        openSnack: false,
        disabledBtn: false,
    };

    function ReducerFuction(draft, action) {
        switch (action.type) {
            case 'catchListingInfo':
                draft.listingInfo = action.listingObject;
                break;

            case 'loadingDone':
                draft.dataIsLoading = false;
                break;

            case 'catchSellerProfileInfo':
                draft.sellerProfileInfo = action.profileObject;
                break;

            case 'openTheSnack':
                draft.openSnack = true;
                break;

            case 'disableTheButton':
                draft.disabledBtn = true;
                break;

            case 'allowTheButton':
                draft.disabledBtn = false;
                break;
        }
    }

    const [state, dispatch] = useImmerReducer(ReducerFuction, initialState);

    // request to get listing info
    useEffect(() => {
        async function GetListingInfo() {
            try {
                const response = await Axios.get(
                    `https://homehome-backend.herokuapp.com/api/listings/${params.id}/`
                );

                dispatch({
                    type: 'catchListingInfo',
                    listingObject: response.data,
                });
            } catch (e) {}
        }
        GetListingInfo();
    }, []);

    // request to get profile info
    useEffect(() => {
        if (state.listingInfo) {
            async function GetProfileInfo() {
                try {
                    const response = await Axios.get(
                        `https://homehome-backend.herokuapp.com/api/profiles/${state.listingInfo.seller}/`
                    );

                    dispatch({
                        type: 'catchSellerProfileInfo',
                        profileObject: response.data,
                    });
                    dispatch({ type: 'loadingDone' });
                } catch (e) {}
            }
            GetProfileInfo();
        }
    }, [state.listingInfo]);

    const listingPictures = [
        state.listingInfo.picture1,
        state.listingInfo.picture2,
        state.listingInfo.picture3,
        state.listingInfo.picture4,
        state.listingInfo.picture5,
    ].filter((picture) => picture !== null);

    // const [currentPicture, setCurrentPicture] = useState(0);

    // function NextPicture() {
    //     if (currentPicture === listingPictures.length - 1) {
    //         return setCurrentPicture(0);
    //     } else {
    //         return setCurrentPicture(currentPicture + 1);
    //     }
    // }

    // function PreviousPicture() {
    //     if (currentPicture === 0) {
    //         return setCurrentPicture(listingPictures.length - 1);
    //     } else {
    //         return setCurrentPicture(currentPicture - 1);
    //     }
    // }

    const date = new Date(state.listingInfo.date_posted);
    const formattedDate = `${
        date.getMonth() + 1
    }/${date.getDate()}/${date.getFullYear()}`;

    async function DeleteHandler() {
        const confirmDelete = window.confirm(
            'Are you sure you want to delete this listing?'
        );
        if (confirmDelete) {
            try {
                const response = await Axios.delete(
                    `https://homehome-backend.herokuapp.com/api/listings/${params.id}/delete/`
                );

                dispatch({ type: 'openTheSnack' });
                dispatch({ type: 'disableTheButton' });
            } catch (e) {
                dispatch({ type: 'allowTheButton' });
            }
        }
    }

    useEffect(() => {
        if (state.openSnack) {
            setTimeout(() => {
                navigate('/listings');
            }, 1500);
        }
    }, [state.openSnack]);

    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

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
        <div>
            <div style={{ padding: '1rem' }}>
                <Breadcrumbs aria-label='breadcrumb'>
                    <Link
                        onClick={() => navigate('/listings')}
                        color='inherit'
                        style={{
                            cursor: 'pointer',
                            textDecoration: 'none',
                            '&:hover': { textDecoration: 'underlined' },
                        }}
                    >
                        Listings
                    </Link>

                    <p>{state.listingInfo.title}</p>
                </Breadcrumbs>
            </div>

            {/* Image slider */}
            <div>
                <ImageList
                    item
                    container
                    // justifyContent='center'
                    style={{
                        position: 'relative',
                        display: 'flex',
                        flexDirection: 'row',
                    }}
                >
                    {listingPictures.map((picture, index) => {
                        return (
                            <ImageListItem key={index}>
                                <img
                                    src={`${picture}?w=164&h=164&fit=crop&auto=format`}
                                    srcSet={`${picture}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
                                    alt='Listing Picture'
                                    loading='lazy'
                                />
                            </ImageListItem>
                        );
                    })}
                </ImageList>
            </div>
            {/* More information */}

            <div
                style={{
                    padding: '1rem',
                    position: 'sticky',
                    top: '4rem',
                    backgroundColor: '#fff',
                    boxShadow: '0 0 0.1rem 0',
                }}
            >
                <h2>
                    {state.listingInfo.listing_type} |{' '}
                    {state.listingInfo.property_status === 'Sale'
                        ? `$${state.listingInfo.price
                              .toString()
                              .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`
                        : `$${state.listingInfo.price
                              .toString()
                              .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}/${
                              state.listingInfo.rental_frequency
                          }`}
                </h2>
                <h4>
                    {state.listingInfo.title} | {state.listingInfo.borough} |{' '}
                    {formattedDate} | {state.listingInfo.rooms} BD
                </h4>
            </div>
            <div
                style={{
                    display: 'flex',
                    padding: '1rem',
                    justifyContent: 'space-around',
                }}
            >
                {state.listingInfo.furnished ? (
                    <div style={{ display: 'flex' }}>
                        <AutoAwesomeIcon /> <h6> Furnished | </h6>
                    </div>
                ) : (
                    ''
                )}

                {state.listingInfo.pool ? (
                    <div style={{ display: 'flex' }}>
                        <PoolIcon /> <h6> Pool </h6>
                    </div>
                ) : (
                    ''
                )}

                {state.listingInfo.elevator ? (
                    <div style={{ display: 'flex' }}>
                        <ElevatorIcon /> <h6> Elevator </h6>
                    </div>
                ) : (
                    ''
                )}

                {state.listingInfo.cctv ? (
                    <div style={{ display: 'flex' }}>
                        <VideoCameraFrontIcon /> <h6> CCTV </h6>
                    </div>
                ) : (
                    ''
                )}

                {state.listingInfo.parking ? (
                    <div style={{ display: 'flex' }}>
                        <LocalParkingIcon /> <h6> Parking </h6>
                    </div>
                ) : (
                    ''
                )}
            </div>
            <hr style={{ width: '90%', margin: 'auto' }} />
            {/* Description */}
            {state.listingInfo.description ? (
                <div
                    style={{
                        padding: '1rem 5% 1rem 5%',
                    }}
                >
                    <h2>Overview</h2>
                    <p>{state.listingInfo.description}</p>
                </div>
            ) : (
                ''
            )}
            <hr style={{ width: '90%', margin: 'auto' }} />
            {/* Seller Info */}
            <div style={{ padding: '1rem 5% 1rem 5%' }}>
                <h2>Contact Agent</h2>
                <div
                    style={{
                        width: '100%',
                        display: 'flex',
                        justifyContent: 'space-evenly',
                    }}
                >
                    <div style={{ display: 'flex' }}>
                        <div style={{ padding: '1rem' }}>
                            <h3>{state.sellerProfileInfo.agency_name}</h3>

                            <IconButton>
                                <LocalPhoneIcon />{' '}
                                {state.sellerProfileInfo.phone_number}
                            </IconButton>
                        </div>
                    </div>
                    <div>
                        <img
                            style={{
                                height: '10rem',
                                width: '15rem',
                                cursor: 'pointer',
                            }}
                            src={
                                state.sellerProfileInfo.profile_picture !== null
                                    ? state.sellerProfileInfo.profile_picture
                                    : defaultProfilePicture
                            }
                            onClick={() =>
                                navigate(
                                    `/agencies/${state.sellerProfileInfo.seller}`
                                )
                            }
                            alt='Agent Picture'
                        />
                    </div>
                </div>
            </div>
            <div>
                {GlobalState.userId === state.listingInfo.seller ? (
                    <>
                        <hr style={{ width: '90%', margin: 'auto' }} />
                        <Grid item container justifyContent='space-around'>
                            <Button
                                variant='contained'
                                color='primary'
                                onClick={handleClickOpen}
                            >
                                Update
                            </Button>
                            <Button
                                variant='contained'
                                color='error'
                                onClick={DeleteHandler}
                                disabled={state.disabledBtn}
                            >
                                Delete
                            </Button>
                            <Dialog
                                open={open}
                                onClose={handleClose}
                                fullScreen
                            >
                                <ListingUpdate
                                    listingData={state.listingInfo}
                                    closeDialog={handleClose}
                                />
                            </Dialog>
                        </Grid>
                    </>
                ) : (
                    ''
                )}
            </div>
            <hr style={{ width: '90%', margin: 'auto' }} />
            {/* Map */}
            <Grid
                item
                container
                style={{ padding: '1rem 5% 1rem 5%' }}
                spacing={1}
                justifyContent='space-between'
            >
                <Grid item xs={3} style={{ overflow: 'auto', height: '35rem' }}>
                    {state.listingInfo.listing_pois_within_10km.map((poi) => {
                        function DegreeToRadian(coordinate) {
                            return (coordinate * Math.PI) / 180;
                        }

                        function CalculateDistance() {
                            const latitude1 = DegreeToRadian(
                                state.listingInfo.latitude
                            );
                            const longitude1 = DegreeToRadian(
                                state.listingInfo.longitude
                            );

                            const latitude2 = DegreeToRadian(
                                poi.location.coordinates[0]
                            );
                            const longitude2 = DegreeToRadian(
                                poi.location.coordinates[1]
                            );
                            // The formula
                            const latDiff = latitude2 - latitude1;
                            const lonDiff = longitude2 - longitude1;
                            const R = 6371000 / 1000;

                            const a =
                                Math.sin(latDiff / 2) * Math.sin(latDiff / 2) +
                                Math.cos(latitude1) *
                                    Math.cos(latitude2) *
                                    Math.sin(lonDiff / 2) *
                                    Math.sin(lonDiff / 2);
                            const c =
                                2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

                            const d = R * c;

                            const dist =
                                Math.acos(
                                    Math.sin(latitude1) * Math.sin(latitude2) +
                                        Math.cos(latitude1) *
                                            Math.cos(latitude2) *
                                            Math.cos(lonDiff)
                                ) * R;
                            return dist.toFixed(2);
                        }
                        return (
                            <div
                                key={poi.id}
                                style={{
                                    marginBottom: '0.5rem',
                                    border: '1px solid black',
                                }}
                            >
                                <Typography variant='h6'>{poi.name}</Typography>
                                <Typography variant='subtitle1'>
                                    {poi.type} |{' '}
                                    <span
                                        style={{
                                            fontWeight: 'bolder',
                                            color: 'green',
                                        }}
                                    >
                                        {CalculateDistance()} Kilometers
                                    </span>
                                </Typography>
                            </div>
                        );
                    })}
                </Grid>
                <Grid item xs={9} style={{ height: '35rem' }}>
                    <MapContainer
                        center={[
                            state.listingInfo.latitude,
                            state.listingInfo.longitude,
                        ]}
                        zoom={14}
                        scrollWheelZoom={true}
                    >
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
                        />
                        <Marker
                            position={[
                                state.listingInfo.latitude,
                                state.listingInfo.longitude,
                            ]}
                        >
                            <Popup>{state.listingInfo.title}</Popup>
                        </Marker>
                        {state.listingInfo.listing_pois_within_10km.map(
                            (poi) => {
                                function PoiIcon() {
                                    if (poi.type === 'Stadium') {
                                        return stadiumIcon;
                                    } else if (poi.type === 'Hospital') {
                                        return hospitalIcon;
                                    } else if (poi.type === 'University') {
                                        return universityIcon;
                                    }
                                }
                                return (
                                    <Marker
                                        key={poi.id}
                                        position={[
                                            poi.location.coordinates[0],
                                            poi.location.coordinates[1],
                                        ]}
                                        icon={PoiIcon()}
                                    >
                                        <Popup>{poi.name}</Popup>
                                    </Marker>
                                );
                            }
                        )}
                    </MapContainer>
                </Grid>
            </Grid>
            <Snackbar
                open={state.openSnack}
                message='You have successfully deleted the property!'
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
            />
        </div>
    );
}

export default ListingDetail2;
