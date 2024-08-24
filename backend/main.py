from flask import Flask, request, jsonify
from flask_pymongo import PyMongo
from flask_cors import CORS
from bson.objectid import ObjectId
import bcrypt
import jwt

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


@app.route("/workouts", methods=["GET"])
def get_workouts():
  type = request.args.get("type")
  print(f"TYPE: {type}")
  workouts = mongo.db.workouts.find({"type": type})
  workouts_list = [mongo_to_json(workout) for workout in workouts]
  return jsonify(workouts_list)

@app.route("/", methods=["POST"])
def add_workout(): 
  new_workout = request.json
  result = mongo.db.workouts.insert_one(new_workout)
  return (f"Workout {result.inserted_id} inserted!")
  

@app.route("/<id>", methods=["DELETE"])
def delete_workout(id):
  result = mongo.db.workouts.delete_one({"_id": ObjectId(id)})
  if (result.deleted_count == 1):
    return "Success!"
  else:
    return "Error!"
  
@app.route("/workouts/<id>", methods=["PUT", "GET"])
def update_workout(id):
  updated_workout = request.json
  if ('_id' in updated_workout):
    del updated_workout['_id']

  result = mongo.db.workouts.update_one({'_id': ObjectId(id)}, {'$set': updated_workout})
  if result.matched_count > 0:
    return jsonify({"message": "Workout updated successfully"}), 200
  else:
    return jsonify({"message": "Workout not found"}), 404
  

### Log in routes
@app.route("/register", methods=["POST"])
def register_user():
  data = request.json
  username = data.get("username")
  password = data.get("password")

  user = mongo.db.users.find_one({"username": username})
  if user:
    return jsonify({"message": "User already exists"}), 400
  
  hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

  mongo.db.users.insert_one({"username": username, "password": hashed_password})
  return jsonify({"message": "User created successfully"}), 201

if __name__ == "__main__":
  app.run(port = 8000, debug=True)