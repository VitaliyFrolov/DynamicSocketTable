package main

import (
	"encoding/json"
	"log"
	"math/rand"
	"net/http"
	"strconv"

	"github.com/gorilla/websocket"
)

type TestData struct {
	Name  string  `json:"name"`
	Value float64 `json:"value"`
	ID    uint    `json:"id" gorm:"primaryKey"`
}

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

func socketHandler(w http.ResponseWriter, r *http.Request) {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println("Upgrade error:", err)
		return
	}
	defer conn.Close()

	for {
		_, msg, err := conn.ReadMessage()
		if err != nil {
			log.Println("Read error:", err)
			break
		}

		var request map[string]interface{}
		err = json.Unmarshal(msg, &request)
		if err != nil {
			log.Println("Error unmarshalling message:", err)
			break
		}

		if request["type"] == "getTestData" {
			var data []TestData
			for i := 1; i <= 10; i++ {
				value := rand.Float64() * 10
				name := "test-" + strconv.Itoa(i)
				data = append(data, TestData{
					Name:  name,
					Value: float64(int(value*10000)) / 10000,
					ID:    uint(i),
				})
			}

			requestId, _ := request["requestId"].(string)

			response := map[string]interface{}{
				"type":      "getTestData",
				"payload":   data,
				"requestId": requestId,
			}

			msg, _ := json.Marshal(response)
			if err := conn.WriteMessage(websocket.TextMessage, msg); err != nil {
				log.Println("Write error:", err)
				break
			}
		}
	}
}

func main() {
	http.HandleFunc("/test", socketHandler)

	log.Println("Server started at :8080 port")
	log.Fatal(http.ListenAndServe(":8080", nil))
}
