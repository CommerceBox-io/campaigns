class Capaigns {
    /**
     * Constructs a new Campaigns instance.
     * @param {Object} options - The options for configuring the search core.
     * @param {string} [options.uuid=""] - The UUID, hash of user id.
     * @param {string} options.containerSelector - The CSS selector for the container element.
     */
    constructor({uuid = "guest", containerSelector}) {
        this.endpoint = "https://example.com/campaigns/product-slider"
        this.container = document.querySelector(containerSelector);
        this.initializeUser(this, uuid);
        this.fetchData(this).then(data => {
            if (data) {
                this.container.innerHTML = data.toString();
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
        const props = {
            uuid: context.uuid,
        };

        return fetch(context.endpoint, {
            method: "POST",
            headers: {
                "Content-Type": "application/json;charset=UTF-8",
            },
            body: JSON.stringify(props),
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.code !== 200) {
                    return null;
                }
                return data.result;

            })
            .catch((error) => {
                console.error("Error fetching data:", error);
                return null;
            });
    }
}

export default Capaigns;
