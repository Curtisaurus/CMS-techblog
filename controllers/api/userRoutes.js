const router = require('express').Router();
const { User, Post } = require('../../models');
const withAuth = require('../../utils/auth');

router.get('/', async (req, res) => {
  try {
    const userData = await User.findAll({
      attributes: {
        exclude: ['password']
      }
    });

    res.status(200).json(userData);

  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/:id', async (req, res) => {
  try {
    const userData = await User.findByPk(req.params.id, {
      attributes: {
        exclude: ['password']
      },
      include: [
        {
          model: Post,
          attributes: ['id', 'title', 'content', 'createdAt']
        }
      ]
    });

    if (!userData) {
      res.status(404).json({ message: 'No user found with this id' });
      return;
    }

    res.status(200).json(userData);

  } catch (err) {
    res.status(500).json(err);
  }
});

router.post('/', async (req, res) => {
  try {
    const userData = await User.create(req.body);

    req.session.save(() => {
      req.session.user_id = userData.id;
      req.session.logged_in = true;

      res.status(200).json(userData);
    });
  } catch (err) {
    res.status(400).json(err);
  }
});

router.post('/login', async (req, res) => {
  try {
    const userData = await User.findOne({ where: { name: req.body.name } });

    if (!userData) {
      res
        .status(400)
        .json({ message: 'Incorrect username or password, please try again' });
      return;
    }

    const validPassword = await userData.checkPassword(req.body.password);

    if (!validPassword) {
      res
        .status(400)
        .json({ message: 'Incorrect username or password, please try again' });
      return;
    }

    req.session.save(() => {
      req.session.user_id = userData.id;
      req.session.logged_in = true;
      
      res.json({ user: userData, message: 'You are now logged in!' });
    });

  } catch (err) {
    res.status(400).json(err);
  }
});

router.post('/logout', (req, res) => {
  if (req.session.logged_in) {
    req.session.destroy(() => {
      res.status(204).end();
    });
  } else {
    res.status(404).end();
  }
});

router.put('/:id', withAuth, async (req, res) => {
  try {

    if (req.params.id != req.session.user_id) {
      res.status(403).json({message: "You cannot modify other user's account"})
      return;
    }

    const userData = await User.update(req.body, {
      individualHooks: true,
      where: {
        id: req.params.id
      },
    });

    if (!userData) {
      res.status(404).json({ message: 'No user found with this id!' });
      return;
    }

    res.status(200).json(userData);

  } catch (err) {
    res.status(500).json(err);
  }
});

router.delete('/:id', withAuth, async (req, res) => {
  try {

    if (req.params.id != req.session.user_id) {
      res.status(403).json({message: "You cannot modify other user's account"})
      return;
    }
    
    const userData = await User.destroy({
      where: {
        id: req.params.id
      },
    });

    if (!userData) {
      res.status(404).json({ message: 'No user found with this id!' });
      return;
    }

    res.status(200).json(userData);

  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;