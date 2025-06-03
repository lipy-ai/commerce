#!/bin/bash

get_ip() {
  # macOS
  if command -v ipconfig > /dev/null && ipconfig getifaddr en0 &>/dev/null; then
    ipconfig getifaddr en0
    return
  fi

  # Linux / WSL / Git Bash
  if command -v hostname > /dev/null && hostname -I &>/dev/null; then
    hostname -I | awk '{print $1}'
    return
  fi

  # Windows (Git Bash fallback)
  if command -v ipconfig > /dev/null; then
    ipconfig | grep -Eo 'IPv4 Address[. ]*: ([0-9.]+)' | grep -oE '([0-9]+\.){3}[0-9]+' | head -n 1
    return
  fi

  echo "localhost"
}

# Call and cleanly assign only the first valid IP
LOCAL_IP="$(get_ip | head -n1 | tr -d '\r\n')"

export VITE_LOCAL_IP="$LOCAL_IP"

# Optional: echo once
echo "$VITE_LOCAL_IP"
