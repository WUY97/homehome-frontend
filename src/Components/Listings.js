import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import { useImmerReducer } from 'use-immer';
import { useNavigate } from 'react-router-dom';

import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Icon } from 'leaflet';

import {
    Grid,
    AppBar,
    Typography,
    Card,
    CardMedia,
    CardContent,
    CircularProgress,
} from '@mui/material';

import houseIconPng from './Assets/Mapicons/house.png';
import apartmentIconPng from './Assets/Mapicons/apartment.png';
import officeIconPng from './Assets/Mapicons/office.png';

function Listings() {
    const navigate = useNavigate();
    const houseIcon = new Icon({
        iconUrl: houseIconPng,
        iconSize: [40, 40],
    });

    const apartmentIcon = new Icon({
        iconUrl: apartmentIconPng,
        iconSize: [40, 40],
    });

    const officeIcon = new Icon({
        iconUrl: officeIconPng,
        iconSize: [40, 40],
    });

    const initialState = {
        mapInstance: null,
    };

    function ReducerFuction(draft, action) {
        switch (action.type) {
            case 'getMap':
                draft.mapInstance = action.mapData;
                break;
        }
    }

    const [state, dispatch] = useImmerReducer(ReducerFuction, initialState);

    function TheMapComponent() {
        const map = useMap();
        dispatch({ type: 'getMap', mapData: map });
        return null;
    }

    const [allListings, setAllListings] = useState([]);
    const [dataIsLoading, setDataIsLoading] = useState(true);

    useEffect(() => {
        const source = Axios.CancelToken.source();
        async function GetAllListings() {
            try {
                const response = await Axios.get(
                    'https://homehome-backend.herokuapp.com/api/listings/',
                    { cancelToken: source.token }
                );

                setAllListings(response.data);
                setDataIsLoading(false);
            } catch (error) {
                console.log(error.response);
            }
        }
        GetAllListings();
        return () => {
            source.cancel();
        };
    }, []);

    if (dataIsLoading === true) {
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
        <Grid container style={{backgroundColor: '#EFF1F3'}}>
            <Grid item xs={8}>
                <AppBar position='sticky'>
                    <div style={{height: "calc(100vh - 5.5rem)"}}>
                        <MapContainer
                            center={[51.505, -0.09]}
                            zoom={12}
                            scrollWheelZoom={true}
                        >
                            <TileLayer
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
                            />
                            <TheMapComponent />

                            {allListings.map((listing) => {
                                function IconDisplay() {
                                    if (listing.listing_type === 'House') {
                                        return houseIcon;
                                    } else if (
                                        listing.listing_type === 'Apartment'
                                    ) {
                                        return apartmentIcon;
                                    } else if (
                                        listing.listing_type === 'Office'
                                    ) {
                                        return officeIcon;
                                    }
                                }
                                return (
                                    <Marker
                                        key={listing.id}
                                        icon={IconDisplay()}
                                        position={[
                                            listing.latitude,
                                            listing.longitude,
                                        ]}
                                    >
                                        <Popup
                                            onClick={() =>
                                                navigate(
                                                    `/listings/${listing.id}`
                                                )
                                            }
                                        >
                                            <img
                                                src={listing.picture1}
                                                style={{
                                                    height: '10rem',
                                                    width: '100%',
                                                    cursor: 'pointer',
                                                }}
                                                onClick={() =>
                                                    navigate(
                                                        `/listings/${listing.id}`
                                                    )
                                                }
                                                alt={listing.title}
                                            />
                                            {listing.property_status ===
                                            'Sale' ? (
                                                <Typography
                                                    variant='body1'
                                                    style={{ margin: 0 }}
                                                >
                                                    $
                                                    {listing.price
                                                        .toString()
                                                        .replace(
                                                            /\B(?=(\d{3})+(?!\d))/g,
                                                            ','
                                                        )}
                                                </Typography>
                                            ) : (
                                                <Typography
                                                    variant='body1'
                                                    style={{ margin: 0 }}
                                                >
                                                    $
                                                    {listing.price
                                                        .toString()
                                                        .replace(
                                                            /\B(?=(\d{3})+(?!\d))/g,
                                                            ','
                                                        )}{' '}
                                                    / {listing.rental_frequency}
                                                </Typography>
                                            )}
                                            <Typography
                                                variant='body2'
                                                style={{ margin: 0 }}
                                            >
                                                {listing.borough} |{' '}
                                                {listing.listing_type} for{' '}
                                                {listing.property_status
                                                    .toString()
                                                    .toLowerCase()}{' '}
                                                | {listing.rooms}B{' '}
                                                {listing.rooms === 1 ? '' : 's'}
                                            </Typography>
                                        </Popup>
                                    </Marker>
                                );
                            })}
                        </MapContainer>
                    </div>
                </AppBar>
            </Grid>
            <Grid item xs={4}>
                {allListings.map((listing) => {
                    return (
                        <Card
                            key={listing.id}
                            style={{
                                margin: '0.7rem',
                                position: 'relative',
                                boxShadow: '0.1rem',
                                cursor: 'pointer',
                            }}
                            onClick={() => navigate(`/listings/${listing.id}`)}
                            onMouseOver={() =>
                                state.mapInstance.flyTo(
                                    [listing.latitude, listing.longitude],
                                    16
                                )
                            }
                        >
                            <CardMedia
                                style={{
                                    height: '20rem',
                                    width: '100%',
                                }}
                                component='img'
                                image={listing.picture1}
                                alt={listing.title}
                            />
                            <CardContent>
                                {listing.property_status === 'Sale' ? (
                                    <Typography variant='h5'>
                                        {listing.title}: $
                                        {listing.price
                                            .toString()
                                            .replace(
                                                /\B(?=(\d{3})+(?!\d))/g,
                                                ','
                                            )}
                                    </Typography>
                                ) : (
                                    <Typography variant='h6'>
                                        {listing.title}: $
                                        {listing.price
                                            .toString()
                                            .replace(
                                                /\B(?=(\d{3})+(?!\d))/g,
                                                ','
                                            )}{' '}
                                        / {listing.rental_frequency}
                                    </Typography>
                                )}
                                <Typography variant='body2'>
                                    {listing.borough} | {listing.listing_type}{' '}
                                    for{' '}
                                    {listing.property_status
                                        .toString()
                                        .toLowerCase()}{' '}
                                    | {listing.rooms} Bedroom{' '}
                                    {listing.rooms === 1 ? '' : 's'}
                                </Typography>
                            </CardContent>
                        </Card>
                    );
                })}
            </Grid>
        </Grid>
    );
}

export default Listings;
