.DEFAULT_GOAL :=

PROJECT_NAME ?= release
BUILD_ROOT ?= build

DISTDIR ?= $(BUILD_ROOT)/$(PROJECT_NAME)
DIST := $(DISTDIR).tar

NODE_MODULES := ./node_modules/
BEM := $(NODE_MODULES).bin/bem
NPM := npm
BOWER := $(NODE_MODULES).bin/bower --allow-root
BOWER_COMPONENTS := $(CURDIR)/libs/bower_components
BORSCHIK := $(NODE_MODULES).bin/borschik
BUNDLE := $(CURDIR)/*.bundles
PRODENV := YENV=production XJST_ENGINE=sort-group
FREEZE_PATH := i


ifneq (,$(findstring B,$(MAKEFLAGS)))
	BEM_FLAGS := --force
endif

all:: $(BEM) server

%:: $(BEM) use-development
	$(if $(findstring GNUmakefile,$@),,$(BEM) make $@ $(BEM_FLAGS))

.PHONY: server
server:: $(BEM) libs clean
	@$(BEM) server

$(BEM):: $(NODE_MODULES) $(BOWER_COMPONENTS)

$(NODE_MODULES)::
	$(debug ---> Updating npm dependencies)
	@$(NPM) install

$(BOWER_COMPONENTS)::
	$(debug ---> Updating bower dependencies)
	@$(BOWER) install

.PHONY: clean
clean:: $(BEM)
	$(BEM) make -m clean
	rm -rf $(DISTDIR)
	rm -rf $(FREEZE_PATH)
	rm -f $(DIST)
	ln -snf development .bem/configs/current


.PHONY: pmake pbuild dist-css dist-js dist-html dist-static


pmake: $(BEM) use-production
	$(PRODENV) $(BEM) make

dist-css:: pmake
	find $(BUNDLE) -name '_*.css' | while read line; do \
		$(BORSCHIK) -i $$line -t css --freeze yes > /dev/null; \
	done

dist-js:: pmake
	find $(BUNDLE) -name '_*.js' -a -not \( -name '_*.*.js' \) -o -name '_*.??.js' | while read line; do \
		$(BORSCHIK) -i $$line -t js --freeze yes > /dev/null; \
	done

dist-html:: pmake
	find $(BUNDLE) -name '*.html' -o -name '*.??.html' | while read line; do \
		relpath=`echo $$line | sed 's#^$(CURDIR)##'`; \
		bundle=`dirname $$relpath`; \
		lang=`basename $$relpath | sed -n 's#^.*\(\...\)\.html#\1#p'`; \
		outfile=$(DISTDIR)/$$bundle/index$${lang}.html ; \
		mkdir -p `dirname $$outfile` ; \
		$(BORSCHIK) -i $$line -t html --freeze yes | tee $$outfile > /dev/null; \
	done

dist-static:: pmake $(DISTDIR) dist-css dist-js dist-html
	( echo $(FREEZE_PATH); echo robots.txt; echo favicon.ico; ) \
		| tar -cT - | tar -C $(DISTDIR) -xvf-

$(DISTDIR)::
	mkdir -p $(DISTDIR)

.PHONY: use-development use-production dev release dist

use-development:: clean
	ln -snf development .bem/configs/current

use-production:: clean
	ln -snf production .bem/configs/current

pbuild: dist-static

$(DIST): pbuild
	tar -C $(BUILD_ROOT) -cf $(DIST) $(PROJECT_NAME)

dist:: $(DIST)

