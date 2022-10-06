import * as React from 'react';
import { useNavigate } from 'react-router-dom';

function Home() {
    const navigate = useNavigate();
    return (
        <>
            <div class="home">
                    <h1>
                        Find your dream home here!
                    </h1>
                    <button onClick={() => navigate('/listings')}>
                        See all properties 🏠
                    </button>
            </div>
            <div class="footer">
                <a class="footer-link" href="https://github.com/WUY97">Github</a>
                <a class="footer-link" href="https://www.linkedin.com/in/wuy97">LinkedIn</a>
                <a class="footer-link" href="mailto:wu.yito@northeastern.edu">Mail</a>
            </div>
        </>
    )
}


export default Home;
