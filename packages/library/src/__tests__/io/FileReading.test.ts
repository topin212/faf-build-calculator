import { Reader } from "../../io/RawReader"
import "@jest/types";

console.log(test)

class JunkyItemData {
  properpty: number 
}

class Item {
  id: string
  name: string
  description: string
  itemData: JunkyItemData
}

class RoomObject {
  id: string 
  name: string
  description: string
  items: Item[]
}

class Room {
  name: string 
  objects: RoomObject[]
}
/*

object = object1 [...]
                   ^- object definition


object1 [ 
  name = roomName, 
  desc = roomDesc, 
  items = [ item1 [], item2 [], item3[] ]
]
object2 [
  name = ...

]
    
  * object 2 
  * object 3
*/



test('data should be read correctly', () => {
  const testJSON = {
    data: "test",
    nested: {
      data: "test"
    }
  }

  const reader = new Reader(JSON.stringify(testJSON))
  expect(reader.jsonData).toMatchObject(testJSON)
})