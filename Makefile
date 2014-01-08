MOCHA = ./node_modules/.bin/mocha
REPORTER = list

test:
	@$(MOCHA) -R spec

.PHONY: test
