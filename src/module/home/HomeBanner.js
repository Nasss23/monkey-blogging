import React from 'react';
import styled from 'styled-components';
import Button from '../../components/button/Button';

const HomeBannerStyles = styled.div`
    min-height: 520px;
    padding: 40px 0;
    background-image: linear-gradient(
        to right bottom,
        ${props => props.theme.primary}, 
        ${props => props.theme.secondary}
    );

    .banner {
        display:  flex;
        justify-content: space-between;
        align-items: center;
        &-content{
            max-width: 600px;
            color: white;
        }
        &-heading{
            font-size: 36px;
            margin-bottom: 20px;
        }
        &-desc{
            line-height: 1.75;
            margin-bottom: 40px;
        }
}
`

const HomeBanner = () => {
    return (
        <HomeBannerStyles>
            <div className="container">
                <div className="banner">
                    <div className="banner-content">
                        <h1 className="banner-heading">Monkey Blogging</h1>
                        <p className="banner-desc">
                            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Labore incidunt amet, autem quia a minus mollitia. Consequuntur accusantium sint adipisci quisquam ipsa pariatur omnis ab, obcaecati dolorum iusto provident dicta.
                        </p>
                        <Button to="/sign-up" kind={'secondary'}>Get Started</Button>
                    </div>
                    <div className="banner-image">
                        <img src="/img-banner.png" alt="banner" />
                    </div>
                </div>
            </div>
        </HomeBannerStyles>
    );
};

export default HomeBanner;