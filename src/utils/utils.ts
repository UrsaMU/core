import { dbObj } from "../models/DBObj";

/**
 * Return the next available DBref number.
 * @returns
 */
export const id = async () => {
  const dbrefs = await dbObj.find({}).populate("dbref").exec();
  const nums = dbrefs.map((ref) => parseInt(ref.dbref.slice(1), 10));

  var mia = nums.sort().reduce(function (acc: number[], cur, ind, arr) {
    var diff = cur - arr[ind - 1];
    if (diff > 1) {
      var i = 1;
      while (i < diff) {
        acc.push(arr[ind - 1] + i);
        i++;
      }
    }
    return acc;
  }, []);
  return mia.length > 0 ? `#${mia[0]}` : `#${nums.length}`;
};
