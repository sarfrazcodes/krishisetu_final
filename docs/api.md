GET /crops
Response:
[
  {
    "name": "Wheat",
    "price": 2200,
    "trend": "up"
  }
]

GET /crop/{name}
Response:
{
  "price": 2200,
  "prediction": 2350,
  "weather_risk": "medium"
}