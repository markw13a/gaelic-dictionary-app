# Install and configure any dependencies needed to run and build app locally

# Fastlane used to automate building and deployment of app to Play Store
sudo apt-get install ruby-full
sudo gem install bundler
sudo bundle update

# Fetch secret keys from repo
# Copy to appropriate locations

fastlane run validate_play_store_json_key json_key:./google-play.json
cd ./android && fastlane init
