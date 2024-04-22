../../data/normalized.json:
	cd ../../data && $(MAKE) normalized.json

data: ../../data/normalized.json

dev: data
	bun x astro dev

# build:
# 	bun x astro check && bun x astro build

build: data
	bun x astro build
