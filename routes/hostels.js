const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, validateHostel, isAuthor } = require('../middleware');
const hostels = require('../controllers/hostels');

const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({storage});

router.route('/')
    .get(catchAsync(hostels.index))
    .post(isLoggedIn,upload.array('image'), validateHostel, catchAsync(hostels.createHostel))

router.get('/new', isLoggedIn, hostels.renderNewForm);
 
router.route('/:id')
    .get(catchAsync(hostels.showHostel))
    .put(isLoggedIn, isAuthor, upload.array('image'),validateHostel,catchAsync(hostels.updateHostel))
    .delete(isLoggedIn, isAuthor, catchAsync(hostels.deleteHostel))


router.get('/:id/edit',isLoggedIn, isAuthor, catchAsync(hostels.renderEditForm));
router.post('/search',catchAsync(hostels.searchHostel));

module.exports = router;