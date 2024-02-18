import mqtt from "mqtt";

export class MQTT {
    #MQTT_PREFIX: string = "at/htl-vil/arsicn/chat/";
    #client?: mqtt.MqttClient;
    #onMessageCallback: (topic: string, message: Buffer) => void;

    constructor(user: string, onMessageCallback: (topic: string, message: Buffer) => void) {
        this.#onMessageCallback = onMessageCallback;
        mqtt.connectAsync("ws://test.mosquitto.org:8081")
        .then((client) => {
            this.#client = client;
            this.subscribe(user);
            this.subscribe('all');
            this.#client?.on("message", this.#onMessageCallback);
            console.log("Connected!");
        })
        .catch((err) => {
            throw new Error(err);
        });  
    }

    subscribe(suffix: string) {
        this.#client?.subscribe(this.#MQTT_PREFIX +suffix);
    }

    publish(suffix: string, user: string, message: string) {
        if (!this.#client?.connected) throw new Error("Not connected!");
        const MQTT_FULLSTR = this.#MQTT_PREFIX +suffix;
        const dateObj = new Date();
        const [date, time] = dateObj.toISOString().split("T");
        const dateStr = `${date} ${time.substring(0, 8)}`;
        const payload = `${crypto.randomUUID()}\n${user}\n${dateStr}\n${message}`;
        this.#client?.publish(MQTT_FULLSTR, payload, {
            qos: 0
        });
        return payload;
    }

    deleteMessage(suffix: string, uuid: string) {
        const MQTT_FULLSTR = this.#MQTT_PREFIX +suffix;
        this.#client?.publish(MQTT_FULLSTR, `DELETE MESSAGE ${uuid}`, {
            qos: 0
        })
    }
}