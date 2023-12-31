from locust import HttpUser, task, between, events

class DynamicPathUser(HttpUser):
    wait_time = between(1, 2.5)
    paths = ['/']  # Initialize with a default path, to be dynamically updated

    def on_start(self):
        # Perform any setup tasks here, if necessary
        # This is where you would dynamically set the paths
        pass

    @task
    def load_test_paths(self):
        for path in self.paths:
            self.client.get(path)
