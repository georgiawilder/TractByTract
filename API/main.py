import numpy as np 
import flask
import string
from flask import jsonify, request, Flask
import os, json


app = Flask(__name__)

def read_file(file_name):
    with open(file_name) as json_file:
        data = json.load(json_file)
    return data 
    

class Prediction():
    def __init__(self, Borocode,GeoID, tract, state, prediction, orig):
        self.Borocode = Borocode
        self.GeoID = GeoID 
        self.state = state 
        self.prediction = prediction
        self.orig = orig 
        self.tract = tract 

    @property
    def serialize(self):
        return {
            'prediction': str(round(self.prediction,2)),
            'tract': str(self.tract),
            'GeoID': str(self.GeoID),
            'Borocode': self.Borocode,
            'state': self.state, 
            'orig':self.orig
        }


@app.route('/')
def predsFunctionAll():
    if request.method == 'GET':
        response = app.make_response(get_predictions(None)) 
        response.headers['Access-Control-Allow-Origin'] = '*'
        return response

@app.route('/state=<state>', methods=['GET'])
def predsFunction(state):
    if request.method == 'GET':
        response = app.make_response(get_predictions(state)) 
        response.headers['Access-Control-Allow-Origin'] = '*'
        #print(response)
        return response 

def get_predictions(state):
    ## states; all predictions 
    if state is None:
        preds = []  
        # for i in range(1,57):
        i = 36
        data = read_file("data/"+str(i) +"_data.txt")
        preds.extend([Prediction(item["Borocode"], item["GeoID"], item["tract"], item["state"], item["prediction"], item["orig"]) for item in data["tracts"]])
        return jsonify([p.serialize for p in preds])
    ## state specific predictions 
    else: 
        try: 
            data = read_file("data/"+str(state) +"_data.txt")
        except: 
            return jsonify([])
        # Borocode,GeoID, tract, state, prediction, orig
        preds = [Prediction(item["Borocode"], item["GeoID"], item["tract"], item["state"], item["prediction"], item["orig"]) for item in data["tracts"]]
        return jsonify([p.serialize for p in preds])




if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, threaded=True)
    # host = "localhost"
    # app_server = gevent.wsgi.WSGIServer((host, port), app)
    # app_server.serve_forever()
