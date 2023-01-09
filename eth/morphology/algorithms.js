//DILATION ===================================================================

function dilation(inputImg, structImg) {
  var newImage = emptySquareArray(N);

  for(var i = 0; i < N; i++) {
    for(var j = 0; j < N; j++) {
      if(inputImg[i][j] >= 2) {

        const Mhalf = (M-1)/2;
        for(var i2 = 0; i2 < M; i2++) {
          for(var j2 = 0; j2 < M; j2++) {
            if(structImg[i2][j2] == 1) {
              changePixValue(i+i2-Mhalf,j+j2-Mhalf, 2);
            }
          }
        }
      }
    }
  }

  for(var i = 0; i < N; i++) {
    for(var j = 0; j < N; j++) {
        if(inputImg[i][j] >= 2) {
          newImage[i][j] = 3;
        }
    }
  }

  inputImg = newImage;

  function changePixValue(i,j, color) {
    if(0 <= i && i < N && 0 <= j && j < N) {
         newImage[i][j] = color;
    }
  }

  return newImage;
}



//EROSION ====================================================================


function erosion(inputImg, structImg) {
  var newImage = emptySquareArray(N);
  for(var i = 0; i < N; i++) {
    for(var j = 0; j < N; j++) {
      if(checkArea(i,j)) {
        newImage[i][j] = 3;
      }
    }
    newImage[i][j] = 1;
  }

  for(var i = 0; i < N; i++) {
    for(var j = 0; j < N; j++) {
        if(inputImg[i][j] >= 2 && newImage[i][j] <= 2) {
          newImage[i][j] = 1;
        }
    }
  }

  function checkArea(i,j) {

    // if(hasPixel(i+1,j+1)) {
    //   return true;
    // }

    const Mhalf = (M-1)/2;
    for(var i2 = 0; i2 < M; i2++) {
      for(var j2 = 0; j2 < M; j2++) {
        if(structImg[i2][j2] == 1) {
          if(hasPixel(i+i2-Mhalf,j+j2-Mhalf) == false) {
            return false;
          }
        }
      }
    }
    return true;
  }

  function hasPixel(i,j) {
    if(0 <= i && i < N && 0 <= j && j < N) {
      if(inputImg[i][j] >= 2) {
        return true;
      }
      return false;
    }
    return true;
  }

  return newImage;

}


// HIT AND MISS ================================================================

function hitAndMiss(inputImg, structreImg, rotateAll) {
  if(!rotateAll) {
    return hitAndMiss2(inputImg, structreImg);
  }

  var res1 = hitAndMiss2(inputImg, structreImg);
  var res2 = hitAndMiss2(inputImg, rotate(structreImg));
  var res3 = hitAndMiss2(inputImg, rotate(rotate(structreImg)));
  var res4 = hitAndMiss2(inputImg, rotate(rotate(rotate(structreImg))));

  var newImage = emptySquareArray(N);

  for(var i = 0; i < N; i++) {
    for(var j = 0; j < N; j++) {
      if(res1[i][j] >= 2 || res2[i][j] >= 2 || res3[i][j] >= 2 || res4[i][j] >= 2) {
        newImage[i][j] = 3;
      }
    }
  }

  return newImage;

}

function rotate(structreImg) {
  var newImage = emptySquareArray(N);

  for(var i = 0; i < M; i++) {
    for(var j = 0; j < M; j++) {
      newImage[M-j-1][i] = structreImg[i][j];
    }
  }

  return newImage;
}

function hitAndMiss2(inputImg, structImg) {
  var newImage = emptySquareArray(N);

  for(var i = 0; i < N; i++) {
    for(var j = 0; j < N; j++) {
      if(checkArea(i,j)) {
        newImage[i][j] = 3;
      }
    }
  }

  function checkArea(i,j) {

    const Mhalf = (M-1)/2;
    for(var i2 = 0; i2 < M; i2++) {
      for(var j2 = 0; j2 < M; j2++) {
        if(structImg[i2][j2] == 1) {
          if(hasPixel(i+i2-Mhalf,j+j2-Mhalf) == false) {
            return false;
          }
        }
        else if(structImg[i2][j2] == 0) {
          if(hasPixelInverse(i+i2-Mhalf,j+j2-Mhalf) == false) {
            return false;
          }
        }
      }
    }
    return true;
  }

  function hasPixel(i,j) {
    if(0 <= i && i < N && 0 <= j && j < N) {
      if(inputImg[i][j] >= 2) {
        return true;
      }
      return false;
    }
    return false;
  }

  function hasPixelInverse(i,j) {
    if(0 <= i && i < N && 0 <= j && j < N) {
      if(inputImg[i][j] < 2) {
        return true;
      }
      return false;
    }
    return true;
  }

  return newImage;
}

// THINNING ====================================================================


function thinning(inputImg, structImg, rotateAll) {
  var newImage = emptySquareArray(N);

  temp = hitAndMiss(inputImg, structImg, rotateAll);


  for(var i = 0; i < N; i++) {
    for(var j = 0; j < N; j++) {
      if(temp[i][j] == 0) {
        newImage[i][j] = inputImg[i][j];
      }
    }
  }

  return newImage;
}

// THINKENING ==================================================================

function thickening(inputImg, structImg, rotateAll) {
  var newImage = emptySquareArray(N);

  temp = hitAndMiss(inputImg, structImg, rotateAll);

  for(var i = 0; i < N; i++) {
    for(var j = 0; j < N; j++) {
      if(temp[i][j] >= 2 || inputImg[i][j] >= 2) {
        newImage[i][j] = 3;
      }
    }
  }

  return newImage;
}
