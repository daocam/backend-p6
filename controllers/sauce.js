const Sauce = require('../models/sauce.js');

exports.getAllSauce = (req, res, next) => {
  Sauce.find()
    .then(sauces => res.status(200).json(sauces))
    .catch(error => res.status(400).json({ error }))
}

exports.createSauce = (req, res, next) => {
  Sauce.create(req.body)
    .then(() => res.status(201).json({ message: 'Sauce enregistrée !' }))
    .catch(error => res.status(400).json({ error }))
}

exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then(sauce => res.status(200).json(sauce))
    .catch(error => res.status(404).json({ error }))
}

exports.updateSauce = (req, res, next) => {
  Sauce.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Sauce modifiée !' }))
    .catch(error => res.status(400).json({ error }))
}

exports.deleteSauce = (req, res, next) => {
  Sauce.deleteOne({ _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Sauce supprimée !' }))
    .catch(error => res.status(400).json({ error }))
}

// exports.likeOrDislikeSauce = (req, res, next) => {
//   const like = req.body.like;
//     if(like === 1) { // bouton j'aime
//       Sauce.updateOne({_id: req.params.id}, { $inc: { likes: 1}, $push: { usersLiked: req.body.userId}, _id: req.params.id })
//       .then( () => res.status(200).json({ message: 'Vous aimez cette sauce!' }))
//       .catch( error => res.status(400).json({ error}));
//     } else if(like === -1) { // bouton je n'aime pas
//       Sauce.updateOne({_id: req.params.id}, { $inc: { dislikes: 1}, $push: { usersDisliked: req.body.userId}, _id: req.params.id })
//       .then(() => res.status(200).json({ message: 'Vous n’aimez pas cette sauce!' }))
//       .catch( error => res.status(400).json({ error}));
//     } else {    // annulation de l'action j'aime ou alors je n'aime pas
//       Sauce.findOne({_id: req.params.id})
//       .then(sauce => {
//         if(sauce.usersLiked.indexOf(req.body.userId)!== -1) {
//           Sauce.updateOne({_id: req.params.id}, { $inc: { likes: -1},$pull: { usersLiked: req.body.userId}, _id: req.params.id })
//             .then(() => res.status(200).json({ message: 'Vous n’aimez plus cette sauce!' }))
//             .catch(error => res.status(400).json({ error}));
//         }
//         else if( sauce.usersDisliked.indexOf(req.body.userId)!== -1) {
//           Sauce.updateOne( {_id: req.params.id}, { $inc: { dislikes: -1 }, $pull: { usersDisliked: req.body.userId}, _id: req.params.id})
//             .then(() => res.status(200).json({ message: 'Vous aimerez peut-être cette sauce à nouveau!' }))
//             .catch(error => res.status(400).json({ error}));
//         }           
//       })
//       .catch(error => res.status(400).json({ error})) ;            
//     }   
// }

exports.likeOrDislikeSauce = async (req, res, next) => {
  const like = req.body.like;
  const userId = req.body.userId;
  const sauceId = req.params.id;

  try {
    const sauce = await Sauce.findOne({ _id: sauceId });

    if (like === 1) {
      if (!sauce.usersLiked.includes(userId)) {
        sauce.likes++;
        sauce.usersLiked.push(userId);
        if (sauce.usersDisliked.includes(userId)) {
          sauce.dislikes--;
          sauce.usersDisliked = sauce.usersDisliked.filter(id => id !== userId);
        }
      }
    } else if (like === -1) {
      if (!sauce.usersDisliked.includes(userId)) {
        sauce.dislikes++;
        sauce.usersDisliked.push(userId);
        if (sauce.usersLiked.includes(userId)) {
          sauce.likes--;
          sauce.usersLiked = sauce.usersLiked.filter(id => id !== userId);
        }
      }
    } else {
      if (sauce.usersLiked.includes(userId)) {
        sauce.likes--;
        sauce.usersLiked = sauce.usersLiked.filter(id => id !== userId);
      } else if (sauce.usersDisliked.includes(userId)) {
        sauce.dislikes--;
        sauce.usersDisliked = sauce.usersDisliked.filter(id => id !== userId);
      }
    }

    await sauce.save();
    res.status(200).json({ message: 'Action processed successfully' });
  } catch (error) {
    res.status(400).json({ error });
  }
};
