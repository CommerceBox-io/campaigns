class Capaigns {
    /**
     * Constructs a new Campaigns instance.
     * @param {Object} options - The options for configuring the search core.
     * @param {string} [options.user=""] - The user identifier.
     * @param {string} [options.website=""] - The website identifier.
     */
    constructor({user = "guest", website = ""}) {
        this.endpoint = "https://prism.commercebox.io/api/v1/slider"
        this.user = user;
        this.website = website;
        this.initializeUser(this, user);
        this.fetchData(this).then(data => {
            if (data) {
                if (data.position) {
                    const selector = document.querySelector(data.position);
                    if (selector) {
                        selector.innerHTML = data.output;
                    }
                }
            }
        });

    }

    /**
     * Initializes the user by setting the UUID in local storage.
     * @param context - The SearchCore instance.
     * @param uuid - The unique user id.
     */
     initializeUser(context, uuid) {
        context.uuid = localStorage.getItem('cbscuuid');
        if (!context.uuid || (uuid !== "guest" && context.uuid !== uuid) || (uuid === "guest" && !context.uuid.startsWith("guest-"))) {
            context.uuid = this.getUUID(uuid);
            localStorage.setItem('cbscuuid', context.uuid);
        }
    }

    /**
     * Retrieves a UUID. If the provided UUID is "guest", it generates a new guest UUID.
     * Otherwise, it returns the provided UUID.
     * @param {string} uuid - The UUID to process.
     * @returns {string} The processed or generated UUID.
     */
    getUUID(uuid) {
        if (uuid === "guest") {
            return this.generateUUID();
        }
        return uuid
    }

    /**
     * Generates a new guest UUID in the format 'guest-xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.
     * @returns {string} A newly generated guest UUID.
     */
    generateUUID() {
        return 'guest-xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            let r = Math.random() * 16 | 0,
                v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    /**
     * Fetches data from the API endpoint based on the given query.
     * @param {object} context - The SearchCore instance.
     * @returns {Promise} - The promise representing the fetch operation.
     */
    fetchData(context) {
        const param = context.website ? `?website=${context.website}` : (context.user ? `?user=${context.user}` : '');
        return fetch(`${context.endpoint}${param}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json;charset=UTF-8",
            },
        })
            .then((response) => response.json())
            .then((data) => {
                return data || null;
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
                return null;
            });
    }
}

export default Capaigns;
