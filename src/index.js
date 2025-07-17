class Campaigns {
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
            if (data?.position && data?.output) {
                this.insertHtmlAndExecuteScripts(data).then();
            }
        });

    }

    /**
     * Inserts HTML content into the DOM at the specified position and executes any scripts or loads any stylesheets.
     * This method handles both inline and external resources, ensuring proper loading order and error handling.
     *
     * @param {Object} jsonResponse - The response object containing the HTML content and target position
     * @param {string} jsonResponse.output - The HTML content to be inserted
     * @param {string} jsonResponse.position - The CSS selector for the target element where content will be inserted
     * @returns {Promise<void>} A promise that resolves when all resources are loaded and scripts are executed
     *
     */
    async insertHtmlAndExecuteScripts(jsonResponse) {
        const { output, position } = jsonResponse;

        const targetElement = document.querySelector(position);

        if (!targetElement) {
            console.error(`Element with selector "${position}" not found`);
            return;
        }

        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = output;

        const links = tempDiv.querySelectorAll('link[rel="stylesheet"]');
        const externalCSS = [];

        links.forEach(link => {
            if (link.href) {
                externalCSS.push({
                    href: link.href,
                    media: link.media || 'all',
                    type: link.type || 'text/css'
                });
            }
            // Remove link from the temp div
            link.remove();
        });

        const scripts = tempDiv.querySelectorAll('script');
        const externalScripts = [];
        const inlineScripts = [];

        scripts.forEach(script => {
            if (script.src) {
                externalScripts.push({
                    type: 'external',
                    src: script.src,
                    async: script.async || false,
                    defer: script.defer || false
                });
            } else {
                inlineScripts.push({
                    type: 'inline',
                    content: script.innerHTML || script.textContent
                });
            }
            script.remove();
        });

        targetElement.innerHTML = tempDiv.innerHTML;

        function loadExternalCSS(linkInfo) {
            return new Promise((resolve, reject) => {
                if (document.querySelector(`link[href="${linkInfo.href}"]`)) {
                    resolve();
                    return;
                }

                const linkElement = document.createElement('link');
                linkElement.rel = 'stylesheet';
                linkElement.href = linkInfo.href;
                linkElement.media = linkInfo.media;
                linkElement.type = linkInfo.type;

                linkElement.onload = () => resolve();
                linkElement.onerror = () => reject(new Error(`Failed to load CSS: ${linkInfo.href}`));

                document.head.appendChild(linkElement);
            });
        }

        function loadExternalScript(scriptInfo) {
            return new Promise((resolve, reject) => {
                if (document.querySelector(`script[src="${scriptInfo.src}"]`)) {
                    resolve();
                    return;
                }

                const scriptElement = document.createElement('script');
                scriptElement.src = scriptInfo.src;
                scriptElement.async = scriptInfo.async;
                scriptElement.defer = scriptInfo.defer;

                scriptElement.onload = () => resolve();
                scriptElement.onerror = () => reject(new Error(`Failed to load script: ${scriptInfo.src}`));

                document.head.appendChild(scriptElement);
            });
        }

        try {
            await Promise.all([
                ...externalCSS.map(loadExternalCSS),
                ...externalScripts.map(loadExternalScript)
            ]);
        } catch (error) {
            console.error('Error loading external resources:', error);
        }

        // Execute inline scripts after external resources are loaded
        inlineScripts.forEach(script => {
            try {
                console.log(script.content)
                eval(script.content);
            } catch (error) {
                console.error('Error executing inline script:', error);
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

export default Campaigns;
