import { useState } from "react";
import {v4 as uuidv4 } from "uuid";  

export const useSaveData = (url) => {
    const [data, setData] = useState({
        cidade: "",
        id: "",
    });

    const saveData = async () => {
        try {
            const response = await fetch(url, {
                method: "POST",
                body: JSON.stringify({ ...data, id: uuidv4() }),
                headers: {
                    "Content-Type": "application/json",
                },
            });
            
            if (!response.ok) {
                throw new Error("Request failed");
            }

            const responseData = await response.json();
            setData(responseData);
        } catch (err) {}
    };

    return {data, setData, saveData};
};