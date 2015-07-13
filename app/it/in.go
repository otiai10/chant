package it

type It struct {
	v interface{}
}

func Is(v interface{}) *It {
	return &It{v}
}

func (_it *It) In(cands ...interface{}) bool {
	for _, candidate := range cands {
		if _it.v == candidate {
			return true
		}
	}
	return false
}
