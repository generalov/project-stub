.DEFAULT_GOAL :=

PROJECT_NAME ?= release
BUILD_ROOT ?= build
DISTDIR ?= $(BUILD_ROOT)/$(PROJECT_NAME)
DIST := $(DISTDIR).tar

NODE_MODULES := ./node_modules/

ENB := $(NODE_MODULES).bin/enb
NPM := npm

BOWER := $(NODE_MODULES).bin/bower --allow-root
BOWER_COMPONENTS := $(CURDIR)/libs/bower_components
BORSCHIK := $(NODE_MODULES).bin/borschik
BUNDLE := $(CURDIR)/*.bundles
PRODENV := YENV=production XJST_ENGINE=sort-group
FREEZE_PATH := i


ifneq (,$(findstring B,$(MAKEFLAGS)))
	ENB_FLAGS := --no-cache
endif

all:: $(ENB) server

%:: $(ENB)
	$(if $(findstring GNUmakefile,$@),,$(ENB) make $@ $(ENB_FLAGS))

.PHONY: server
server:: $(ENB) use-development libraries.get
	echo "Open http://127.0.0.1:8080/desktop.bundles/index/index.html to see build results."
	@$(ENB) server

$(ENB):: $(NODE_MODULES) $(BOWER_COMPONENTS)

$(NODE_MODULES)::
	$(debug ---> Updating npm dependencies)
	@$(NPM) install

$(BOWER_COMPONENTS)::
	$(debug ---> Updating bower dependencies)
	@$(BOWER) install

.PHONY: clean
clean::
	$(ENB) make clean
	rm -rf $(DISTDIR)
	rm -rf $(FREEZE_PATH)
	rm -f $(DIST)
	ln -snf development configs/current


.PHONY: pmake pbuild dist-css dist-js dist-html dist-static


pmake: $(ENB) use-production
	$(PRODENV) $(ENB) make --no-cache

dist-html:: pmake
	find $(BUNDLE) -name '_*.html' -o -name '_*.??.html' | while read line; do \
		relpath=`echo $$line | sed 's#^$(CURDIR)##'`; \
		bundle=`dirname $$relpath`; \
		lang=`basename $$relpath | sed -n 's#^.*\(\...\)\.html#\1#p'`; \
		outfile=$(DISTDIR)/index$${lang}.html ; \
		mkdir -p `dirname $$outfile` ; \
		cat $$line | tee $$outfile > /dev/null; \
	done

dist-static:: pmake $(DISTDIR) dist-html
	( echo $(FREEZE_PATH); echo favicon.ico; ) \
		| tar -cT - | tar -C $(DISTDIR) -xvf-

$(DISTDIR)::
	mkdir -p $(DISTDIR)

.PHONY: use-development use-production dev release dist

use-development:: clean
	ln -snf development configs/current

use-production:: clean
	ln -snf production configs/current

pbuild: dist-static

$(DIST): pbuild
	tar -C $(BUILD_ROOT) -cf $(DIST) $(PROJECT_NAME)

dist:: $(DIST)
