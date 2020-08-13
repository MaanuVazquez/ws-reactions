# Turnero monorepo
[![lerna](https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg)](https://lerna.js.org/)

## Requirements
- [NVM](https://github.com/nvm-sh/nvm)
- [Yarn](https://yarnpkg.com/)

## Commands

| Name        | Description                                           |
| ----------- | ----------------------------------------------------- |
| `bootstrap` | Links the packages that are installed into each other |
| `publish`   | Publishes the packages new versions                   |
| `lerna`     | Executes the lerna cli                                |

## FAQ

### (ZSH only) Automatically load NVM version whenever we enter (cd) into a directory with a `.nvmrc` file

- Add into `.zshrc` file the following:

```
# NVM USE PLUGIN
autoload -U add-zsh-hook
load-nvmrc() {
  local node_version="$(nvm version)"
  local nvmrc_path="$(nvm_find_nvmrc)"

  if [ -n "$nvmrc_path" ]; then
    local nvmrc_node_version=$(nvm version "$(cat "${nvmrc_path}")")

    if [ "$nvmrc_node_version" = "N/A" ]; then
      nvm install
    elif [ "$nvmrc_node_version" != "$node_version" ]; then
      nvm use
    fi
  elif [ "$node_version" != "$(nvm version default)" ]; then
    echo "Reverting to nvm default version"
    nvm use default
  fi
}
add-zsh-hook chpwd load-nvmrc
load-nvmrc
```