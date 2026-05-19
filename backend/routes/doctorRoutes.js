


// Backend: doctorRoutes.js

// const express = require('express');
// const router = express.Router();
// const doctorController = require('../controller/doctorController');
// const { authenticateDoctor } = require('../middleware/doctorMiddleware');
// const upload = require('../middleware/multerConfig');

// router.get('/profile', authenticateDoctor, doctorController.getDoctorProfile);
// router.put('/profile', authenticateDoctor, doctorController.updateDoctorProfile);
// router.put('/profile-image', authenticateDoctor, upload.single('profileImage'), doctorController.updateProfileImage);
// router.post('/register', upload.single('profile_image'), doctorController.registerDoctor);
// module.exports = router;


// const express = require('express');
// const router = express.Router();
// const doctorController = require('../controller/doctorController');
// const { authenticateDoctor } = require('../middleware/doctorMiddleware');
// const upload = require('../middleware/multerConfig');

// router.get('/profile', authenticateDoctor, doctorController.getDoctorProfile);
// router.put('/profile', authenticateDoctor, doctorController.updateDoctorProfile);
// router.put(
//   '/profile-image',
//   authenticateDoctor,
//   upload.single('profileImage'),
//   doctorController.updateProfileImage
// );

// // register: يقبل صورة شخصية (اختياري) + CV بصيغة PDF (اختياري)
// router.post(
//   '/register',
//   upload.fields([
//     { name: 'profile_image', maxCount: 1 },
//     { name: 'cv', maxCount: 1 },
//   ]),
//   doctorController.registerDoctor
// );

// module.exports = router;




const express = require('express');
const router = express.Router();
const doctorController = require('../controller/doctorController');
const { authenticateDoctor } = require('../middleware/doctorMiddleware');
const upload = require('../middleware/multerConfig');

router.get('/profile', authenticateDoctor, doctorController.getDoctorProfile);
router.put('/profile', authenticateDoctor, doctorController.updateDoctorProfile);
router.put(
  '/profile-image',
  authenticateDoctor,
  upload.single('profileImage'),
  doctorController.updateProfileImage
);
router.put(
  '/cv',
  authenticateDoctor,
  upload.single('cv'),
  doctorController.updateCV
);
router.post(
  '/register',
  upload.fields([
    { name: 'profile_image', maxCount: 1 },
    { name: 'cv', maxCount: 1 },
  ]),
  doctorController.registerDoctor
);

module.exports = router;