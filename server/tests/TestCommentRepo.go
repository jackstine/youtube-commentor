package test

import (
	"math"
	"testing"
	"youtube-commentor/repos"
)

func TestCommentRepo(t *testing.T) {
	got := math.Abs(-1)
	if got != 1 {
			t.Errorf("Abs(-1) = %T; want 1", got)
	}
	repos.Comment
}


/**
1. need to import the gorm.go into this package....
2. 
*/
