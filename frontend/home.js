function findTravelBuddies() {

    const from =
        document
            .getElementById("fromLocation")
            .value
            .trim();


    const destination =
        document
            .getElementById("destinationInput")
            .value
            .trim();


    const startDate =
        document
            .getElementById("startDate")
            .value;


    const endDate =
        document
            .getElementById("endDate")
            .value;


    const budget =
        document
            .getElementById("budgetInput")
            .value;


    const interests =
        document
            .getElementById("interestsInput")
            .value
            .trim();


    if (!from) {

        alert("Please enter where you are travelling from.");

        return;

    }


    if (!destination) {

        alert("Please enter your destination.");

        return;

    }


    if (!startDate || !endDate) {

        alert("Please select your travel dates.");

        return;

    }


    if (!budget) {

        alert("Please select your budget style.");

        return;

    }


    if (!interests) {

        alert("Please enter at least one travel interest.");

        return;

    }


    const preferences = {

        from: from,

        destination: destination,

        startDate: startDate,

        endDate: endDate,

        budget: budget,

        interests: interests

    };


    localStorage.setItem(

        "ferenePreferences",

        JSON.stringify(preferences)

    );


    window.location.href =
        "swipe.html";

}