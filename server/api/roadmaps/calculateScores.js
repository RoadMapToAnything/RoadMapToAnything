var calculateWilsonScore = function(roadmap) {
    
    var wilsonScore = function(p,n){      
      return ((p + 1.9208) / (p + n) - 1.96 * Math.sqrt((p * n) / (p + n) + 0.9604) / (p + n)) / (1 + 3.8416 / (p + n));
    };


    completions = roadmap.completions || 1;
    upvotes = roadmap.upvotes.length;
    downvotes = roadmap.downvotes.length;
    comments = roadmap.comments.length;
    totalVotes = upvotes + downvotes;

    var normalizeCompletions = function(completions, upvotes){
      /*We want upvotes as the parameter to normalize by because if a roadmap is overwhelmingly
        negative our completions would artificially make the roadmap more visible. By using upvotes
        completions of a good roadmap get boosted highly, but completions of a bad roadmap don't subject
        more people to the bad roadmap. Furthermore, controversial roadmaps will have a boost given to them
        making them more visible, allowing for its goodness/badness to be decided through more visibility
      */
      

      var lowerBound = Math.round(upvotes * .3);
      // If a roadmap has a lot of completions but no upvotes 
        // A completion is worth 3 upvotes
      var upperBound = completions * 3;

      
      
      /*
        Right now we are saying that we expect a factor of 10% completions per upvote. 
        If we have a small roadmap with a lot of completions those get weighted more heavily. Up until
        the point where we approach the maximum limit we want upvotes to account for.
      */
      // The smaller the roadmap the more a completion is worth
      // 1 completion is worth 3 upvotes but can only contrbute an extra 30% of upvotes to final score
      var completionScore = lowerBound >= upperBound ? lowerBound : upperBound;
      return completionScore; 
    }


    var normalizeComments = function(upvotes,downvotes, comments) {
      // Comments are more swingy. In general a comment can be something bad or something good.
        // Since this is a score of if the roadmap is a "good map" 
        // The effect of comments should take into account whether the sentiment indicated by upvotes/downvotes
        // is overwhelmingly negative or positive.
        var netRating = upvotes - downvotes;
        var totalRatings = upvotes  + downvotes
        if ( netRating >= totalRatings * 1.2  ) {
          var positiveRoadmap = true;
        } else if (netRating <= (0 - totalRatings * 1.2)) {
          var negativeRoadmap = true;
        } else {
          var neutralRoadmap = true;
        }
        // If upvotes + downvotes < 100  default to neutral (not significant enough)
          // if 20% of total votes in either negative or positive direction we call it a either positive or negative roadmap else neutral

        var upperBound, lowerBound, completionScore;
        if (neutralRoadmap){
          upperBound = comments * 2;
          lowerBound = upvotes * .1;
          completionScore = Math.min(upperBound,lowerBound);
        } else{
          upperBound = comments * 2;
          lowerBound = upvotes * .15;
          completionScore = Math.min(upperBound,lowerBound);
          completionScore = positiveRoadmap === true ? completionScore : completionScore * -1;
        }

        return completionScore;


    }
    
    var positiveScore = upvotes + normalizeCompletions(completions, upvotes) + normalizeComments(upvotes,downvotes,comments);


    scored = wilsonScore(positiveScore,downvotes);
    console.log(scored, 'WilsonScore')
    return scored;

  }

  module.exports = calculateWilsonScore;