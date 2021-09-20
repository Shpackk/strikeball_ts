export const imageFileFilter = (req, file, callback) => {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
        const error = {
          message: 'Unsupported Filetype'
      }
    return callback(error, false);
  }
  callback(null, true);
};

export const fileNameGen = (req, file, callback) => {
    const name = file.originalname.split('.')[0];
    const dateNow = Date.now().toString()
  callback(null, `${name}-${dateNow}`);
}