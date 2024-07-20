"use client";

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import propertiesData from '../data/properties';
import { Doughnut } from 'react-chartjs-2';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Chart, ArcElement } from 'chart.js';
Chart.register(ArcElement);

const Dashboard: React.FC = () => {
  const searchParams = useSearchParams();
  const search = searchParams.get('players');
  const initialPlayers = JSON.parse(search).map((player: any) => ({
    ...player,
    lentAmounts: {}, // Initialize lent amounts as an empty object
  }));
  

  const [properties, setProperties] = useState(propertiesData);
  const [players, setPlayers] = useState(initialPlayers);
  const [selectedPlayer, setSelectedPlayer] = useState<string | null>(null);
  const [selectedProperty, setSelectedProperty] = useState<any | null>(null);
  const [ownedProperty, setOwnedProperty] = useState<any | null>(null);
  const [tradePopupVisible, setTradePopupVisible] = useState(false);
  const [propertyToTrade, setPropertyToTrade] = useState<any | null>(null);
  const [secondaryPlayer, setSecondaryPlayer] = useState<string | null>(null);
  const [tradeWithExtraMoney, setTradeWithExtraMoney] = useState(false);
  const [tradeAmount, setTradeAmount] = useState<number | null>(null);
  const [rentPopupVisible, setRentPopupVisible] = useState(false);
  const [activeRentProperty, setActiveRentProperty] = useState<any | null>(null);
  const [payPopupVisible, setPayPopupVisible] = useState(false);
  const [payAmount, setPayAmount] = useState<number | null>(null);
  const [payRecipient, setPayRecipient] = useState<string | 'bank' | null>(null);
  const [lendPopupVisible, setLendPopupVisible] = useState(false);
  const [lendAmount, setLendAmount] = useState<number | null>(null);
  const [lendRecipient, setLendRecipient] = useState<string | null>(null);
  const [repayPopupVisible, setRepayPopupVisible] = useState(false);
  const [repayAmount, setRepayAmount] = useState<number | null>(null);
  const [repayRecipient, setRepayRecipient] = useState<string | null>(null);
  const [addFundsPopupVisible, setAddFundsPopupVisible] = useState(false);
  const [addFundsAmount, setAddFundsAmount] = useState<number | null>(null);
  const [freeHotelPopupVisible, setFreeHotelPopupVisible] = useState(false);
  const [propertiesToAddHotel, setPropertiesToAddHotel] = useState<Property[]>([]);
  const [selectedPropertyForHotel, setSelectedPropertyForHotel] = useState<Property | null>(null);
  const [removeHotelPopupVisible, setRemoveHotelPopupVisible] = useState(false);
  const [propertiesWithHotels, setPropertiesWithHotels] = useState<Property[]>([]);
  const [selectedPropertyForRemoval, setSelectedPropertyForRemoval] = useState<Property | null>(null);
  const [auctionAmount, setAuctionAmount] = useState<number | null>(null);
  const [showAuctionInput, setShowAuctionInput] = useState<boolean>(false);

  


  





  const availableProperties = properties.filter(property => property.owner === 'bank');

  const groupPropertiesByColor = () => {
    const groupedProperties: { [key: string]: any[] } = {};
    availableProperties.forEach(property => {
      if (!groupedProperties[property.color_code]) {
        groupedProperties[property.color_code] = [];
      }
      groupedProperties[property.color_code].push(property);
    });
    return groupedProperties;
  };

  const groupedProperties = groupPropertiesByColor();

  const buyProperty = (propertyName: string) => {
    const property = properties.find(p => p.name.toLowerCase() === propertyName.toLowerCase());
    const playerIndex = players.findIndex(p => p.name === selectedPlayer);
    if (property && playerIndex !== -1 && property.owner === 'bank') {
      if (players[playerIndex].funds >= property.cost) {
        // Deduct the cost from the player's funds
        const updatedPlayers = [...players];
        updatedPlayers[playerIndex].funds -= property.cost;

        // Update the property's owner
        const updatedProperties = properties.map(p =>
          p.name === property.name ? { ...p, owner: selectedPlayer } : p
        );

        setProperties(updatedProperties);
        setPlayers(updatedPlayers);
        setSelectedProperty(null);  // Close the popup after purchase
      } else {
        console.log("Insufficient funds");
        toast.error("Insuffiecient Funds!");
      }
    } else {
      console.log("Property not available or not found");
      toast.error("Please Select a Player to start the game!");
    }
  };

  const handleBuyClick = () => {
    if (selectedProperty) {
      buyProperty(selectedProperty.name);
    }
  };

  const buyHotel = (property: any) => {
    const playerIndex = players.findIndex(p => p.name === selectedPlayer);

    // Check if property already has a hotel
    if (property.hasHotel) {
      toast.error("This property already has a hotel!");
      return;
    }

    if (players[playerIndex].funds >= property.hotel_cost) {
      const updatedPlayers = [...players];
      updatedPlayers[playerIndex].funds -= property.hotel_cost;

      const updatedProperties = properties.map(p =>
        p.name === property.name ? { ...p, hasHotel: true } : p
      );

      setProperties(updatedProperties);
      setPlayers(updatedPlayers);
      setOwnedProperty(null);  // Close the popup after purchase
    } else {
      console.log("Insufficient funds to buy hotel");
      toast.error("Insufficient funds to buy hotel");
      
      
    }
  };

  const handleBuyHotelClick = () => {
    if (ownedProperty) {
      buyHotel(ownedProperty);
    }
  };

  const sellHotel = (property: any) => {
    const playerIndex = players.findIndex(p => p.name === selectedPlayer);

    if (property.hasHotel) {
      const hotelCost = property.hotel_cost;
      const refundAmount = Math.round(hotelCost / 2 / 10) * 10;

      const updatedPlayers = [...players];
      updatedPlayers[playerIndex].funds += refundAmount;

      const updatedProperties = properties.map(p =>
        p.name === property.name ? { ...p, hasHotel: false } : p
      );

      setProperties(updatedProperties);
      setPlayers(updatedPlayers);
      setOwnedProperty(null);  // Close the popup after sale
    } else {
      console.log("No hotel to sell");

      toast.error("No hotel to sell");
    }
  };

  const handleSellHotelClick = () => {
    if (ownedProperty) {
      sellHotel(ownedProperty);
    }
  };

  const sellProperty = (property: any) => {
    const playerIndex = players.findIndex(p => p.name === selectedPlayer);

    if (!property.hasHotel) {
      const propertyCost = property.cost;

      const updatedPlayers = [...players];
      updatedPlayers[playerIndex].funds += propertyCost;

      const updatedProperties = properties.map(p =>
        p.name === property.name ? { ...p, owner: 'bank' } : p
      );

      setProperties(updatedProperties);
      setPlayers(updatedPlayers);
      setOwnedProperty(null);  // Close the popup after sale
    } else {
      console.log("Sell the hotel first");

      toast.error("Sell the hotel first");
    }
  };

  const handleSellPropertyClick = () => {
    if (ownedProperty) {
      sellProperty(ownedProperty);
    }
  };

  const getTotalFunds = (player: any) => {
    const propertyValues = properties
      .filter(property => property.owner === player.name)
      .reduce((sum, property) => sum + property.cost + (property.hasHotel ? property.hotel_cost : 0), 0);
    return player.funds - player.debt + propertyValues;
  };

  const playerOwnsColorSet = (playerName: string, colorCode: string) => {
    const colorProperties = properties.filter(p => p.color_code === colorCode);
    return colorProperties.every(p => p.owner === playerName);
  };

  const getActiveRent = (property: any, playerName: string) => {
    let activeRent;
    if (property.hasHotel) {
      activeRent = property.hotel_rent;
    } else if (playerOwnsColorSet(playerName, property.color_code)) {
      activeRent = property.color_set_rent;
      console.log(activeRent)
    } else {
      activeRent = property.rent;
    }
    return activeRent;
  };

  const handleTradeClick = (property: any) => {
    setPropertyToTrade(property);
    setTradePopupVisible(true);
  };
  
  const handleTradeAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTradeAmount(Number(event.target.value));
  };
  
  const handleTradeConfirmation = () => {
    if (!propertyToTrade || !secondaryPlayer) {
      toast.error("Please select a player and a property to trade.");
      return;
    }
  
    const property = properties.find(p => p.name === propertyToTrade.name);
    const playerIndex = players.findIndex(p => p.name === selectedPlayer);
    const secondaryPlayerIndex = players.findIndex(p => p.name === secondaryPlayer);
  
    if (property && playerIndex !== -1 && secondaryPlayerIndex !== -1) {
      // Perform the trade logic
      const updatedPlayers = [...players];
      let updatedProperties = [...properties];
  
      // Trade property
      updatedProperties = updatedProperties.map(p =>
        p.name === property.name
          ? { ...p, owner: secondaryPlayer }
          : p
      );
  
      // If "Yes" for extra money, update funds accordingly
      if (tradeWithExtraMoney) {
        const tradeAmountToAdd = tradeAmount || 0;
        updatedPlayers[playerIndex].funds -= property.cost + tradeAmountToAdd;
        updatedPlayers[secondaryPlayerIndex].funds += property.cost + tradeAmountToAdd;
      }
  
      setProperties(updatedProperties);
      setPlayers(updatedPlayers);
      setTradePopupVisible(false);
      setPropertyToTrade(null);
      setTradeAmount(null);
      setSecondaryPlayer(null);
      setTradeWithExtraMoney(false);
  
      toast.success("Trade successful!");
    } else {
      toast.error("Error in trading property.");
    }
  };
  
  
  const handleTradeCancel = () => {
    setTradePopupVisible(false);
    setPropertyToTrade(null);
    setTradeAmount(null);
    setSecondaryPlayer(null);
    setTradeWithExtraMoney(false);
  };

  const handleCollectRent = () => {
    if (!activeRentProperty || !secondaryPlayer) {
      toast.error("Please select a player and a property to collect rent from.");
      return;
    }
  
    const property = properties.find(p => p.name === activeRentProperty.name);
    const selectedPlayerIndex = players.findIndex(p => p.name === selectedPlayer);
    const secondaryPlayerIndex = players.findIndex(p => p.name === secondaryPlayer);
  
    if (property && selectedPlayerIndex !== -1 && secondaryPlayerIndex !== -1) {
      const rentAmount = getActiveRent(property, selectedPlayer);
      const updatedPlayers = [...players];
      // Deduct rent from the secondary player
      updatedPlayers[secondaryPlayerIndex].funds -= rentAmount;
  
      // Add rent to the active player
      updatedPlayers[selectedPlayerIndex].funds += rentAmount;
  
      setPlayers(updatedPlayers);
      setRentPopupVisible(false);
      setActiveRentProperty(null);
      setSecondaryPlayer(null);
  
      toast.success("Rent collected successfully!");
    } else {
      toast.error("Error in collecting rent.");
    }
  };
  
  const handleBonusClick = () => {
    if (selectedPlayer) {
      const playerIndex = players.findIndex(p => p.name === selectedPlayer);
      if (playerIndex !== -1) {
        const updatedPlayers = [...players];
        updatedPlayers[playerIndex].funds += 200;
        setPlayers(updatedPlayers);
        toast.success("Bonus of $200 added!");
      } else {
        toast.error("Select a player first!");
      }
    } else {
      toast.error("No player selected!");
    }
  };
  
  const handlePayClick = () => {
    if (selectedPlayer) {
      setPayPopupVisible(true);
    } else {
      toast.error("No player selected!");
    }
  };

  const handlePayAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPayAmount(Number(event.target.value));
  };

  const handlePayConfirmation = () => {
    if (selectedPlayer && payAmount && payRecipient) {
      const playerIndex = players.findIndex(p => p.name === selectedPlayer);
      if (playerIndex === -1) {
        toast.error("Selected player not found.");
        return;
      }
  
      const updatedPlayers = [...players];
      const payer = updatedPlayers[playerIndex];
  
      if (payRecipient === 'bank') {
        if (payer.funds >= payAmount) {
          payer.funds -= payAmount;
          setPlayers(updatedPlayers);
          setPayPopupVisible(false);
          setPayAmount(null);
          setPayRecipient(null);
          toast.success("Payment to the bank successful!");
        } else {
          toast.error("Insufficient funds.");
        }
      } else {
        const recipientIndex = players.findIndex(p => p.name === payRecipient);
        if (recipientIndex === -1) {
          toast.error("Recipient player not found.");
          return;
        }
  
        const recipient = updatedPlayers[recipientIndex];
  
        if (payer.funds >= payAmount) {
          payer.funds -= payAmount;
          recipient.funds += payAmount;
          setPlayers(updatedPlayers);
          setPayPopupVisible(false);
          setPayAmount(null);
          setPayRecipient(null);
          toast.success("Payment to the player successful!");
        } else {
          toast.error("Insufficient funds.");
        }
      }
    } else {
      toast.error("Please enter an amount and select a recipient.");
    }
  };
  
  
  const handleLendClick = () => {
    if (selectedPlayer) {
      setLendPopupVisible(true);
    } else {
      toast.error("No player selected!");
    }
  };

  const handleLendAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLendAmount(Number(event.target.value));
  };
  

  const handleLendConfirmation = () => {
    if (selectedPlayer && lendAmount && lendRecipient) {
      const playerIndex = players.findIndex(p => p.name === selectedPlayer);
      if (playerIndex === -1) {
        toast.error("Selected player not found.");
        return;
      }
  
      const recipientIndex = players.findIndex(p => p.name === lendRecipient);
      if (recipientIndex === -1) {
        toast.error("Recipient player not found.");
        return;
      }
  
      const updatedPlayers = [...players];
      const lender = updatedPlayers[playerIndex];
      const recipient = updatedPlayers[recipientIndex];
  
      if (lender.funds >= lendAmount) {
        lender.funds -= lendAmount;
        recipient.funds += lendAmount;
        recipient.debt += lendAmount;
  
        // Update the lent amounts
        if (!lender.lentAmounts[lendRecipient]) {
          lender.lentAmounts[lendRecipient] = 0;
        }
        lender.lentAmounts[lendRecipient] += lendAmount;
  
        setPlayers(updatedPlayers);
        setLendPopupVisible(false);
        setLendAmount(null);
        setLendRecipient(null);
        toast.success("Lending successful!");
      } else {
        toast.error("Insufficient funds.");
      }
    } else {
      toast.error("Please enter an amount and select a recipient.");
    }
  };
  
  const handleRepayClick = () => {
    if (selectedPlayer) {
      const player = players.find(p => p.name === selectedPlayer);
      if (player && player.debt > 0) {
        setRepayPopupVisible(true);
      } else {
        toast.error("Selected player has no debt to repay.");
      }
    } else {
      toast.error("No player selected!");
    }
  };
  


  const handleRepayConfirmation = () => {
    if (selectedPlayer && repayAmount && repayRecipient) {
      const playerIndex = players.findIndex(p => p.name === selectedPlayer);
      const recipientIndex = players.findIndex(p => p.name === repayRecipient);
  
      if (playerIndex === -1 || recipientIndex === -1) {
        toast.error("Player or recipient not found.");
        return;
      }
      
  
      const updatedPlayers = [...players];
      const payer = updatedPlayers[playerIndex];
      const recipient = updatedPlayers[recipientIndex];
      
      if (repayAmount > payer.debt) {
        toast.error("Amount is more than the debt of the player");
        return;
      }

      if (payer.funds >= repayAmount) {
        payer.funds -= repayAmount;
        payer.debt -= repayAmount;
        recipient.funds += repayAmount;
  
        if (recipient.lentAmounts && recipient.lentAmounts[selectedPlayer]) {
          recipient.lentAmounts[selectedPlayer] -= repayAmount;
          if (recipient.lentAmounts[selectedPlayer] < 0) {
            recipient.lentAmounts[selectedPlayer] = 0;
          }
        }

        setPlayers(updatedPlayers);
        setRepayPopupVisible(false);
        setRepayAmount(null);
        setRepayRecipient(null);
        toast.success("Debt repaid successfully!");
      } else {
        toast.error("Insufficient funds.");
      }
    } else {
      toast.error("Please enter an amount and select a recipient.");
    }
  };
  

  const handleAddFundsClick = () => {
    if (selectedPlayer) {
      setAddFundsPopupVisible(true);
    } else {
      toast.error("No player selected!");
    }
  };

  const handleAddFundsAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAddFundsAmount(Number(event.target.value));
  };

  const handleAddFundsConfirmation = () => {
    if (selectedPlayer && addFundsAmount) {
      const playerIndex = players.findIndex(p => p.name === selectedPlayer);
      if (playerIndex !== -1) {
        const updatedPlayers = [...players];
        updatedPlayers[playerIndex].funds += addFundsAmount;
        setPlayers(updatedPlayers);
        setAddFundsPopupVisible(false);
        setAddFundsAmount(null);
        toast.success(`Added $${addFundsAmount} to ${selectedPlayer}'s funds!`);
      } else {
        toast.error("Selected player not found.");
      }
    } else {
      toast.error("Please enter an amount.");
    }
  };
  

  const handleFreeHotelClick = () => {
    const propertiesWithoutHotel = properties.filter(
      (property) => property.owner === selectedPlayer && !property.hasHotel
    );
  
    setPropertiesToAddHotel(propertiesWithoutHotel);
  
    setFreeHotelPopupVisible(true);
  };
  
  const handleAddHotel = (property: Property) => {
    const updatedProperties = properties.map((p) => 
      p.name === property.name ? { ...p, hasHotel: true } : p
    );
    
    setProperties(updatedProperties);
    
  };
  

  const handleRemoveHotelClick = () => {
    const propertiesWithHotels = properties.filter(
      (property) => property.hasHotel && property.owner !== selectedPlayer
    );
  
    setPropertiesWithHotels(propertiesWithHotels);
  
    setRemoveHotelPopupVisible(true);
  };
  
  
  const handleRemoveHotel = (property: Property) => {
    const updatedProperties = properties.map((p) => 
      p.name === property.name ? { ...p, hasHotel: false } : p
    );
    
    setProperties(updatedProperties);
  };
  
  const handleAuctionClick = () => {
    setShowAuctionInput(true);
  };
  
  const handleAuctionSubmit = () => {
    if (selectedPlayer && selectedProperty && auctionAmount !== null) {
      // Deduct the auction amount from the player's funds
      const updatedPlayers = players.map(player => {
        if (player.name === selectedPlayer) {
          return { ...player, funds: player.funds - auctionAmount };
        }
        return player;
      });
  
      // Update the property owner
      const updatedProperties = properties.map(property => {
        if (property.name === selectedProperty.name) {
          return { ...property, owner: selectedPlayer };
        }
        return property;
      });
  
      // Update state with the new player and property data
      setPlayers(updatedPlayers);
      setProperties(updatedProperties);
  
      // Close the auction input
      setShowAuctionInput(false);
      setAuctionAmount(null);
      setSelectedProperty(null); 

    }
  };

  const getPropertyCount = (playerName) => {
    return properties.filter(property => property.owner === playerName).length;
  };
  
  

  const maxFunds = Math.max(...players.map(getTotalFunds));

  

  return (
    <div className="flex flex-col items-center min-h-screen bg-gradient-to-br from-gray-900 to-blue-900 text-white">
      <h1 className="text-4xl font-bold mb-8 mt-10">Monopoly Dashboard</h1>
      <p className="text-xl font-bold text-left fixed mt-20 bg-black text-white p-3 rounded-xl opacity-75 ml-[150px] lg:ml-[1100px]">
  Active Player: {selectedPlayer}
</p>

      <div className="mb-4">
      
      <div className="mt-4 flex flex-wrap font-bold justify-center text-center">
  <button className="bg-black text-white p-2 rounded mr-5 mb-2 min-w-[96px] md:min-w-24" onClick={handleAddFundsClick}>
    Add Funds
  </button>
  <button className="bg-green-500 text-white p-2 rounded mr-5 mb-2 min-w-[96px] md:min-w-24" onClick={handleBonusClick}>
    Bonus $200
  </button>
  <button className="bg-blue-500 text-white p-2 rounded mr-5 mb-2 min-w-[96px] md:min-w-24" onClick={handlePayClick}>
    Pay
  </button>
  <button className="bg-yellow-500 text-white p-2 rounded mr-5 mb-2 min-w-[96px] md:min-w-24" onClick={handleLendClick}>
    Lend
  </button>
  <button className="bg-red-500 text-white p-2 rounded mb-2 min-w-[96px] md:min-w-24" onClick={handleRepayClick}>
    Repay Debt
  </button>
</div>


    </div>
    <div className="mt-4 flex font-bold">
      <button className="bg-green-500 text-white p-2 rounded mr-5 min-w-24" onClick={handleFreeHotelClick} > Free Hotel </button>
      <button  className="bg-red-500 text-white p-2 rounded min-w-24" onClick={handleRemoveHotelClick} > Remove Hotel </button>
    </div>

      <div className="mt-6">
        <h2 className="text-2xl font-bold mb-4">Players</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
          {players.map((player: any, index: number) => {
            const totalFunds = getTotalFunds(player);
            const fundsRatio = totalFunds / maxFunds;
            const greenRatio = Math.min(fundsRatio, 1);
            const redRatio = 1 - greenRatio;
            return (
              <div
                key={index}
                className={`rounded-lg shadow-lg p-6 ${selectedPlayer === player.name ? 'ring-4 ring-white bg-black text-white' : 'bg-white text-black'}`}
                onClick={() => setSelectedPlayer(player.name)}
              >
                <h3 className="text-xl font-bold mb-2">{player.name}</h3>
                <p className="mb-2">Funds: ${player.funds}</p>
                <p className="mb-2">Debt: ${player.debt}</p>
                <p className="mb-2">Amount Owed:</p>
                <div className="ml-4">
                  {Object.entries(player.lentAmounts).map(([recipient, amount]) => (
                    <p key={recipient} className="text-sm">From {recipient}: ${amount}</p>
                  ))}
                </div>
                <div className="mt-4">
                  <Doughnut
                    data={{
                      labels: ['Funds', 'Deficit'],
                      datasets: [{
                        data: [greenRatio, redRatio],
                        backgroundColor: ['#5cb85c', '#d9534f'],
                      }],
                    }}
                    options={{
                      maintainAspectRatio: false,
                      responsive: true,
                      plugins: {
                        legend: {
                          display: false,
                        },
                        tooltip: {
                          callbacks: {
                            label: (tooltipItem: any, data: any) => {
                              const label = data.labels[tooltipItem.dataIndex];
                              const value = data.datasets[0].data[tooltipItem.dataIndex];
                              return `${label}: ${Math.round(value * 100)}%`;
                            },
                          },
                        },
                      },
                    }}
                  />
                </div>
                <div className="ml-4 mt-4">
                  <p className="text-green-600">Total Networth: ${totalFunds}</p>
                  <p className="text-red-600">Deficit: ${Math.round(maxFunds - totalFunds)}</p>
                </div>
                <div className="mt-4">
                  <h4 className="text-lg font-bold mb-2">Owned Properties: {getPropertyCount(player.name)}</h4>
                  {properties.filter(p => p.owner === player.name).map((property, propIndex) => (
                    <div key={propIndex} className={`rounded-lg shadow-lg p-2 mb-2 cursor-pointer`} style={{ backgroundColor: property.color_code, color: property.font_color }} onClick={() => setOwnedProperty(property)}>
                      <p className="text-sm font-bold">{property.name} {property.hasHotel && '🏠'} - ${property.cost}</p>
                      <p className="text-sm">Rent: ${getActiveRent(property, player.name)}</p>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Available Properties</h2>
          <div>
            {Object.keys(groupedProperties).map((colorCode, colorIndex) => (
              <div key={colorIndex} className="mb-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">
                  {groupedProperties[colorCode].map((property, propIndex) => (
                    <div key={propIndex} className={`rounded-lg shadow-lg p-6 cursor-pointer`} style={{ backgroundColor: property.color_code, color: property.font_color }} onClick={() => setSelectedProperty(property)}>
                      <p className="text-lg font-bold mb-2">{property.name}</p>
                      <p className="mb-2">Cost: ${property.cost}</p>
                      <p className="mb-2">Hotel Cost: ${property.hotel_cost}</p>
                      <p className="mb-2">Rent: ${property.rent}</p>
                      <p className="mb-2">Rent with Color Set: ${property.color_set_rent}</p>
                      <p className="mb-2">Rent with Hotel: ${property.hotel_rent}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <ToastContainer />

      {selectedProperty && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg text-black">
            <h3 className="text-2xl font-bold mb-4">Buy Property</h3>
            <p className="mb-2">Name: {selectedProperty.name}</p>
            <p className="mb-2">Cost: ${selectedProperty.cost}</p>
            <button className="bg-green-500 text-white p-2 rounded" onClick={handleBuyClick}>Buy</button>
            <button className="bg-yellow-500 text-white p-2 rounded ml-2" onClick={handleAuctionClick}>Auction</button>
            <button className="bg-gray-500 text-white p-2 rounded ml-2" onClick={() => setSelectedProperty(null)}>Cancel</button>
          </div>
        </div>
      )}

{ownedProperty && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
    <div className="bg-white p-6 rounded-lg shadow-lg text-black">
      <h3 className="text-2xl font-bold mb-4">Property Options</h3>
      <p className="mb-2">Name: {ownedProperty.name}</p>
      <p className="mb-2">Property Cost: {ownedProperty.cost}</p>
      <p className="mb-2">Hotel Cost: {ownedProperty.hotel_cost}</p>
      <p className="mb-2">Rent with Hotel: {ownedProperty.hotel_rent}</p>
      <div className="flex flex-col space-y-2">
        <button className="bg-blue-500 text-white p-2 rounded" onClick={handleBuyHotelClick}>Buy Hotel</button>
        <button className="bg-red-500 text-white p-2 rounded" onClick={handleSellPropertyClick}>Sell Property</button>
        {ownedProperty.hasHotel && (
          <button className="bg-black text-white p-2 rounded" onClick={handleSellHotelClick}>Sell Hotel</button>
        )}
        <button className="bg-yellow-500 text-white p-2 rounded" onClick={() => {
          setActiveRentProperty(ownedProperty);
          setRentPopupVisible(true);
        }}>Collect Rent</button>
        <button className="bg-green-500 text-white p-2 rounded" onClick={() => handleTradeClick(ownedProperty)}>Trade</button>
      </div>
      <button className="bg-gray-500 text-white p-2 rounded mt-4" onClick={() => setOwnedProperty(null)}>Close</button>
    </div>
  </div>
)}


{tradePopupVisible && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
    <div className="bg-white p-6 rounded-lg shadow-lg text-black">
      <h3 className="text-2xl font-bold mb-4">Trade Property</h3>
      <p className="mb-2">Name: {propertyToTrade?.name}</p>
      <p className="mb-2">Cost: ${propertyToTrade?.cost}</p>
      <p className="mb-2">Trade with Extra Money?</p>
      <button
        className={`p-2 rounded mr-2 text-white ${!tradeWithExtraMoney ? 'bg-green-600' : 'bg-gray-500'}`}
        onClick={() => setTradeWithExtraMoney(false)}
      >
        No
      </button>
      <button
        className={`p-2 rounded text-white ${tradeWithExtraMoney ? 'bg-green-600' : 'bg-gray-500'}`}
        onClick={() => setTradeWithExtraMoney(true)}
      >
        Yes
      </button>
      {tradeWithExtraMoney && (
        <div className="mt-4">
          <label className="block mb-2">Amount:</label>
          <input
            type="number"
            value={tradeAmount || ''}
            onChange={handleTradeAmountChange}
            className="border rounded p-2 w-full"
          />
        </div>
      )}
      <div className="mt-4">
        <h4 className="text-lg font-bold mb-2">Select Player</h4>
        {players.filter(p => p.name !== selectedPlayer).map((player, index) => (
          <button
            key={index}
            className={`block w-full mb-2 p-2 rounded ${secondaryPlayer === player.name ? 'bg-green-600' : 'bg-gray-400'} text-white`}
            onClick={() => setSecondaryPlayer(player.name)}
          >
            {player.name}
          </button>
        ))}
      </div>
      <div className="mt-4">
        <button className="bg-green-500 text-white p-2 rounded mr-2" onClick={handleTradeConfirmation}>Confirm Trade</button>
        <button className="bg-gray-500 text-white p-2 rounded" onClick={handleTradeCancel}>Cancel</button>
      </div>
    </div>
  </div>
)}

{rentPopupVisible && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
    <div className="bg-white p-6 rounded-lg shadow-lg text-black">
      <h3 className="text-2xl font-bold mb-4">Collect Rent</h3>
      <p className="mb-2">Property: {activeRentProperty?.name}</p>
      <p className="mb-2">Amount to collect: ${getActiveRent(activeRentProperty, selectedPlayer)}</p>
      <div className="mt-4">
        <h4 className="text-lg font-bold mb-2">Select Player</h4>
        {players.filter(p => p.name !== selectedPlayer).map((player, index) => (
          <button
            key={index}
            className={`block w-full mb-2 p-2 rounded ${secondaryPlayer === player.name ? 'bg-green-600' : 'bg-gray-400'} text-white`}
            onClick={() => setSecondaryPlayer(player.name)}
          >
            {player.name}
          </button>
        ))}
      </div>
      <div className="mt-4">
        <button className="bg-green-500 text-white p-2 rounded mr-2" onClick={handleCollectRent}>Confirm</button>
        <button className="bg-gray-500 text-white p-2 rounded" onClick={() => {
          setRentPopupVisible(false);
          setActiveRentProperty(null);
          setSecondaryPlayer(null);
        }}>Cancel</button>
      </div>
    </div>
  </div>
)}

{payPopupVisible && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
    <div className="bg-white p-6 rounded-lg shadow-lg text-black">
      <h3 className="text-2xl font-bold mb-4">Pay Amount</h3>
      <div className="mb-4">
        <label className="block mb-2">Amount:</label>
        <input
          type="number"
          value={payAmount || ''}
          onChange={handlePayAmountChange}
          className="border rounded p-2 w-full"
        />
      </div>
      <div className="mb-4">
        <h4 className="text-lg font-bold mb-2">Select Recipient</h4>
        <button
          className={`block w-full mb-2 p-2 rounded ${payRecipient === 'bank' ? 'bg-green-600' : 'bg-gray-400'} text-white`}
          onClick={() => setPayRecipient('bank')}
        >
          Bank
        </button>
        {players.filter(p => p.name !== selectedPlayer).map((player, index) => (
          <button
            key={index}
            className={`block w-full mb-2 p-2 rounded ${payRecipient === player.name ? 'bg-green-600' : 'bg-gray-400'} text-white`}
            onClick={() => setPayRecipient(player.name)}
          >
            {player.name}
          </button>
        ))}
      </div>
      <div className="mt-4">
        <button className="bg-green-500 text-white p-2 rounded mr-2" onClick={handlePayConfirmation}>Confirm</button>
        <button className="bg-gray-500 text-white p-2 rounded" onClick={() => {
          setPayPopupVisible(false);
          setPayAmount(null);
          setPayRecipient(null);
        }}>Cancel</button>
      </div>
    </div>
  </div>
)}

{lendPopupVisible && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
    <div className="bg-white p-6 rounded-lg shadow-lg text-black">
      <h3 className="text-2xl font-bold mb-4">Lend Amount</h3>
      <div className="mb-4">
        <label className="block mb-2">Amount:</label>
        <input
          type="number"
          value={lendAmount || ''}
          onChange={handleLendAmountChange}
          className="border rounded p-2 w-full"
        />
      </div>
      <div className="mb-4">
        <h4 className="text-lg font-bold mb-2">Select Recipient</h4>
        {players.filter(p => p.name !== selectedPlayer).map((player, index) => (
          <button
            key={index}
            className={`block w-full mb-2 p-2 rounded ${lendRecipient === player.name ? 'bg-green-600' : 'bg-gray-400'} text-white`}
            onClick={() => setLendRecipient(player.name)}
          >
            {player.name}
          </button>
        ))}
      </div>
      <div className="mt-4">
        <button className="bg-green-500 text-white p-2 rounded mr-2" onClick={handleLendConfirmation}>Confirm</button>
        <button className="bg-gray-500 text-white p-2 rounded" onClick={() => {
          setLendPopupVisible(false);
          setLendAmount(null);
          setLendRecipient(null);
        }}>Cancel</button>
      </div>
    </div>
  </div>
)}

{repayPopupVisible && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
    <div className="bg-white p-6 rounded-lg shadow-lg text-black">
      <h3 className="text-2xl font-bold mb-4">Repay Debt</h3>
      <label className="block mb-2">
        Amount:
        <input
          type="number"
          value={repayAmount || ''}
          onChange={(e) => setRepayAmount(Number(e.target.value))}
          className="block w-full p-2 mt-2 border rounded"
        />
      </label>
      <label className="block mb-4">
        Recipient:
        <select
          value={repayRecipient || ''}
          onChange={(e) => setRepayRecipient(e.target.value)}
          className="block w-full p-2 mt-2 border rounded"
        >
          <option value="">Select a player</option>
          {players.map((player) => (
            player.name !== selectedPlayer && (
              <option key={player.name} value={player.name}>{player.name}</option>
            )
          ))}
        </select>
      </label>
      <div className="flex justify-end">
        <button className="bg-blue-500 text-white p-2 rounded" onClick={handleRepayConfirmation}>Repay</button>
        <button className="bg-gray-500 text-white p-2 rounded ml-2" onClick={() => setRepayPopupVisible(false)}>Cancel</button>
      </div>
    </div>
  </div>
)}

{addFundsPopupVisible && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
    <div className="bg-white p-6 rounded-lg shadow-lg text-black">
      <h3 className="text-2xl font-bold mb-4">Add Funds</h3>
      <p className="mb-2">Enter amount to add:</p>
      <input
        type="number"
        className="border p-2 rounded w-full"
        value={addFundsAmount ?? ''}
        onChange={handleAddFundsAmountChange}
      />
      <div className="mt-4 flex justify-end">
        <button className="bg-blue-500 text-white p-2 rounded" onClick={handleAddFundsConfirmation}>Add Funds</button>
        <button className="bg-gray-500 text-white p-2 rounded ml-2" onClick={() => setAddFundsPopupVisible(false)}>Cancel</button>
      </div>
    </div>
  </div>
)}


{freeHotelPopupVisible && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
    <div className="bg-white p-6 rounded-lg shadow-lg text-black">
      <h3 className="text-2xl font-bold mb-4">Select Property to Add Hotel</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {propertiesToAddHotel.map((property) => (
          <div
            key={property.name}
            className={`rounded-lg shadow-lg p-4 cursor-pointer ${property === selectedPropertyForHotel ? 'ring-4 ring-blue-500' : ''}`}
            style={{ backgroundColor: property.color_code, color: property.font_color }}
            onClick={() => setSelectedPropertyForHotel(property)}
          >
            <p className="text-lg font-bold mb-2">{property.name}</p>
            <p className="text-sm">Cost to Add Hotel: ${property.hotel_cost}</p>
          </div>
        ))}
      </div>
      <div className="mt-4 flex justify-end">
        <button
          className="bg-blue-500 text-white p-2 rounded mr-2"
          onClick={() => {
            if (selectedPropertyForHotel) {
              // Handle adding a hotel
              handleAddHotel(selectedPropertyForHotel);
              setFreeHotelPopupVisible(false);
            }
          }}
        >
          Add Hotel
        </button>
        <button className="bg-gray-500 text-white p-2 rounded" onClick={() => setFreeHotelPopupVisible(false)}>Cancel</button>
      </div>
    </div>
  </div>
)}

{removeHotelPopupVisible && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
    <div className="bg-white p-6 rounded-lg shadow-lg text-black">
      <h3 className="text-2xl font-bold mb-4">Select Property to Remove Hotel</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {propertiesWithHotels.map((property) => (
          <div
            key={property.name}
            className={`rounded-lg shadow-lg p-4 cursor-pointer ${property === selectedPropertyForRemoval ? 'ring-4 ring-red-500' : ''}`}
            style={{ backgroundColor: property.color_code, color: property.font_color }}
            onClick={() => setSelectedPropertyForRemoval(property)}
          >
            <p className="text-lg font-bold mb-2">{property.name}</p>
            <p className="text-sm">Hotel Cost: ${property.hotel_cost}</p>
          </div>
        ))}
      </div>
      <div className="mt-4 flex justify-end">
        <button
          className="bg-red-500 text-white p-2 rounded mr-2"
          onClick={() => {
            if (selectedPropertyForRemoval) {
              // Handle removing a hotel
              handleRemoveHotel(selectedPropertyForRemoval);
              setRemoveHotelPopupVisible(false);
            }
          }}
        >
          Remove Hotel
        </button>
        <button className="bg-gray-500 text-white p-2 rounded" onClick={() => setRemoveHotelPopupVisible(false)}>Cancel</button>
      </div>
    </div>
  </div>
)}

{showAuctionInput && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
    <div className="bg-white p-6 rounded-lg shadow-lg text-black">
      <h3 className="text-2xl font-bold mb-4">Enter Auction Amount</h3>
      <input
        type="number"
        value={auctionAmount ?? ''}
        onChange={(e) => setAuctionAmount(Number(e.target.value))}
        className="border rounded p-2 w-full"
        placeholder="Enter amount"
      />
      <div className="mt-4 flex justify-end">
        <button className="bg-blue-500 text-white p-2 rounded mr-2" onClick={handleAuctionSubmit}>Submit</button>
        <button className="bg-gray-500 text-white p-2 rounded" onClick={() => setShowAuctionInput(false)}>Cancel</button>
      </div>
    </div>
  </div>
)}


    </div>
  );
};

export default Dashboard;
