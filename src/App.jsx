import React, { useState, useEffect } from "react";
import "./App.css";

const API_KEY = "Ob7-kATzJ8Ixsbmb2vysC0hylEFied28qtDMbLMwLrg";

export default function App() {
  
  const [goals, setGoals] = useState([
    {
      id: 1,
      name: "Electric Scooter",
      totalPrice: 600,
      saved: 0,
      image: "",
      history: []
    }
  ]);


  const [darkMode, setDarkMode] = useState(false);


  const [showTutorial, setShowTutorial] = useState(() => {
    return localStorage.getItem("tutorialDone") !== "true";
  });


  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [moneyAmount, setMoneyAmount] = useState("");
  const [image, setImage] = useState("");


  useEffect(() => {
    const saved =
      localStorage.getItem("moneySaverGoals");

    if (saved) {
      setGoals(JSON.parse(saved));
    }

  }, []);



  useEffect(() => {

    localStorage.setItem(
      "moneySaverGoals",
      JSON.stringify(goals)
    );

  }, [goals]);




  const addGoal = async () => {

    if (!name || !price) return;
  
  
    let image = "/icon.png";
  
  
    try {
  
      const response = await fetch(
        `https://api.unsplash.com/search/photos?query=${encodeURIComponent(name)}&per_page=1`,
        {
          headers: {
            Authorization: `Client-ID ${API_KEY}`
          }
        }
      );
  
  
      const data = await response.json();
  
  
      console.log("UNSPLASH DATA:", data);
  
  
      if (data.results && data.results.length > 0) {
  
        image = data.results[0].urls.small;
  
      }
  
  
    } catch (error) {
  
      console.log("IMAGE SEARCH ERROR:", error);
  
    }
  
  
  
    setGoals([
  
      ...goals,
  
      {
  
        id: Date.now(),
  
        name,
  
        image,
  
        totalPrice: Number(price),
  
        saved: 0,
  
        history: []
  
      }
  
    ]);
  
  
  
    setName("");
  
    setPrice("");
  
  };




  const addMoney = (id, amount) => {

    setGoals(
  
      goals.map(goal => {
  
        if (goal.id !== id)
          return goal;
  
  
        return {
  
          ...goal,
  
          saved:
          goal.saved + Number(amount),
  
  
          history: [
  
            ...goal.history,
  
            {
              amount: Number(amount),
              date: new Date().toLocaleDateString()
            }
  
          ]
  
        };
  
      })
  
    );
  
  };




  const deleteGoal = (id)=>{

    setGoals(

      goals.filter(
        (goal)=>goal.id !== id
      )

    );

  };





  if(showTutorial){

    return(

      <div className="tutorial">

        <h1>
          💰 Money Saver Pro
        </h1>


        <img
          src="/icon.png"
          width="120"
          alt="logo"
        />


        <h2>
          Welcome!
        </h2>


        <p>
          🎯 Step 1: Add something you want
        </p>

        <p>
          💵 Step 2: Add money as you save
        </p>

        <p>
          📈 Step 3: Watch your progress bar
        </p>

        <p>
          🏆 Step 4: Complete your goals
        </p>



        <button

          onClick={()=>{

            localStorage.setItem(
              "tutorialDone",
              "true"
            );


            setShowTutorial(false);

          }}

        >

          Get Started 🚀

        </button>


      </div>

    );

  }





  return (

    <div

      style={{

        background:
        darkMode ? "#111":"white",

        color:
        darkMode ? "white":"black",

        minHeight:"100vh",

        padding:20

      }}

    >



      <h1>
        💰 Money Saver Pro
      </h1>



      <button

        onClick={()=>setDarkMode(!darkMode)}

      >

        Toggle Dark Mode

      </button>



      <hr/>




      <h2>
        Add Goal
      </h2>



      <input

        placeholder="Item Name"

        value={name}

        onChange={(e)=>
          setName(e.target.value)
        }

      />



      <br/><br/>



      <input

        placeholder="Price"

        type="number"

        value={price}

        onChange={(e)=>
          setPrice(e.target.value)
        }

      />



      <br/><br/>



    



      <br/><br/>



      <button onClick={addGoal}>

        Add Goal

      </button>





      <hr/>





      {goals.map((goal)=>{


        const percent =
        (goal.saved /
        goal.totalPrice) * 100;



        return(

          <div

          key={goal.id}

          className="goal-card"

          >



            <h2>
              {goal.name}
            </h2>



            {goal.image && (

              <img

              src={goal.image}

              width="150"

              alt="goal"

              />

            )}




            <p>

            Saved: ${goal.saved}

            </p>



            <p>

            Goal: ${goal.totalPrice}

            </p>




            <div className="progress">


              <div

              className="progress-fill"

              style={{

                width:
                `${Math.min(percent,100)}%`

              }}

              />


            </div>



            <br/>



            <button onClick={()=>
              addMoney(goal.id,1)
            }>
              +$1
            </button>


            <button onClick={()=>
              addMoney(goal.id,10)
            }>
              +$10
            </button>


            <button onClick={()=>
              addMoney(goal.id,50)
            }>
              +$50
            </button>
            <br/><br/>

<input

placeholder="Custom amount"

type="number"

value={moneyAmount}

onChange={(e)=>
setMoneyAmount(e.target.value)}

/>


<button

onClick={()=>{

addMoney(
goal.id,
moneyAmount
);

setMoneyAmount("");

}}

>

Add Money

</button>



            <button onClick={()=>
              deleteGoal(goal.id)
            }>

              Delete

            </button>




            <h3>
              History
            </h3>



            {goal.history.map(
              (item,index)=>(

                <p key={index}>

                  +${item.amount}
                  {" "}
                  {item.date}

                </p>

              )

            )}



          </div>


        );


      })}




    </div>


  );


}