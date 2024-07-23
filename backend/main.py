from flask import Flask, request, jsonify
from flask_pymongo import PyMongo
from flask_cors import CORS

import os
from dotenv import load_dotenv, dotenv_values

app = Flask(__name__)
CORS(app)

load_dotenv()

app.config['MONGO_URI'] = os.getenv("MONGO_DB_URI")
mongo = PyMongo(app)

def mongo_to_json(doc):
  doc['_id'] = str(doc['_id'])
  return doc


@app.route("/", methods=["GET"])
def get_workouts():
  workouts = mongo.db.workouts.find()
  workouts_list = [mongo_to_json(workout) for workout in workouts]
  return jsonify(workouts_list)

@app.route("/", methods=["POST"])
def add_workout(): 
  new_workout = request.json
  result = mongo.db.workouts.insert_one(new_workout)
  if (result.acknowledged == True):
    return "Success!"
  else:
    return "Error!"
  
if __name__ == "__main__":
  app.run(debug=True)