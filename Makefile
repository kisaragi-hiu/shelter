dev:
	cd packages/frontend && $(MAKE) dev

.PHONY: data
data:
	cd data/ && $(MAKE) data
