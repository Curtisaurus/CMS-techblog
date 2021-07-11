const router = require('express').Router();
const { User, Post, Comment } = require('../../models');
const withAuth = require('../../utils/auth');

// gets all comments ordered first by user id then by created time from newest to oldest
router.get('/', async (req, res) => {
  try {
    const commentData = await Comment.findAll({
      order: [
        ['user_id', 'ASC'],
        ['createdAt', 'DESC']
      ],
      include: [
        {
          model: User,
          attributes: ['name']
        },
        {
          model: Post,
          attributes: ['id', 'title'],
          include: [
            {
              model: User,
              attributes: ['name']
            }
          ]
        }
      ]
    });

    res.status(200).json(commentData);

  } catch (err) {
    res.status(500).json(err);
  }
});

// finds all comments for specific post
router.get('/post/:post_id', async (req, res) => {
  try {
    const commentData = await Comment.findAll({
      where: { post_id: req.params.post_id },
      order: [['createdAt', 'DESC']],
      include: [
        {
          model: User,
          attributes: ['name']
        }
      ]
    });

    if (!commentData) {
      res.status(404).json({ message: 'No post with this id' });
    }
    res.status(200).json(commentData);

  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/:id', async (req, res) => {
  try {
    const commentData = await Comment.findByPk(req.params.id, {
      include: [
        {
          model: User,
          attributes: ['name']
        },
        {
          model: Post,
          attributes: ['id', 'title'],
          include: [
            {
              model: User,
              attributes: ['name']
            }
          ]
        }
      ]
    });

    if (!commentData) {
      res.status(404).json({ message: 'No comment found with this id' });
      return;
    }

    res.status(200).json(commentData);

  } catch (err) {
    res.status(500).json(err);
  }
});

router.post('/', withAuth, async (req, res) => {
  try {
    const commentData = await Comment.create({
      ...req.body,
      user_id: req.session.user_id
    });

    res.status(200).json(commentData);
    
  } catch (err) {
    res.status(400).json(err);
  }
});

router.put('/:id', withAuth, async (req, res) => {
  try {
    const commentData = await Comment.update(req.body, {
      where: {
        id: req.params.id
      },
    });

    if (!commentData) {
      res.status(404).json({ message: 'No comment found with this id!' });
      return;
    }

    res.status(200).json(commentData);

  } catch (err) {
    res.status(500).json(err);
  }
});

router.delete('/:id', withAuth, async (req, res) => {
  try {
    const commentData = await Comment.destroy({
      where: {
        id: req.params.id
      },
    });

    if (!commentData) {
      res.status(404).json({ message: 'No comment found with this id!' });
      return;
    }

    res.status(200).json(commentData);

  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;