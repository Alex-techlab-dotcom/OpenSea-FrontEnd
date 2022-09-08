import React from "react";
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import Button from 'react-bootstrap/Button';
import axios from "../../api/axios";
import { BrowserRouter , Routes , Route, Router,Navigate,Link,NavLink } from 'react-router-dom';


export default function AuctionSmallCard({ props }) { 


    function trackUserHistory(event, id) {
        var loggedInUserHistory = localStorage.getItem('userHistory');
        const loggedInUser = localStorage.getItem("user");
        let userToken;
        //console.log(loggedInUser);
        if (loggedInUser) {
            const foundUser = JSON.parse(loggedInUser);            
            userToken = foundUser?.token;
        } 
        //console.log(loggedInUser);
        if (loggedInUserHistory) {
          
            var idArray = [];
            var isUnique = true;
            idArray = JSON.parse(loggedInUserHistory);
            idArray.map(eachId => {
                if(eachId === id) {
                    isUnique = false;
                }
            })
            if (isUnique) { 
                idArray.push(id);
                console.log(idArray);
                localStorage.setItem('userHistory', JSON.stringify(idArray));

                /* Send the post request to train the recommendation algorithm */
                axios.post('/api/auctions/trainAlgo', JSON.stringify(
                    {
                            "auctionIdsList":idArray
                    }
                ),
                {
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${userToken}` },
                withCredentials: true,
                
                })
                .then(function (response) {
                    console.log(response);
                })
                .catch(function (error) {
                    console.log(error);
                });
        }
        } 
      }
      

    
    return (
        <Card className="auctions_card-body" style={{ width: '15rem' }}>
            <Card.Body >
                <Card.Title>{props.name}</Card.Title>
                {/*<Card.Text>
                Some quick example text to build on the card title and make up the
                bulk of the card's content.
                </Card.Text>*/}
            </Card.Body>
            <ListGroup className="list-group-flush" >
                <ListGroup.Item className="auctions_card-body">Location : {props.location}</ListGroup.Item>
                <ListGroup.Item className="auctions_card-body">Auction End Time : {props.auctionEndTime}</ListGroup.Item>
                <ListGroup.Item className="auctions_card-body">Currently : {props.currently} $</ListGroup.Item>
                <ListGroup.Item className="auctions_card-body">Number of Bids : {props.numOfBids} $</ListGroup.Item>
            </ListGroup>
            <Card.Body>
                <NavLink style={{ textDecoration: 'none' }} to={`/OpenSea/Auctions/${props.itemId}`}>
                    <Button variant="primary" onClick={event =>trackUserHistory(event,props.itemId)}>Full details</Button>
                </NavLink>
            </Card.Body>
        </Card>
    );
}