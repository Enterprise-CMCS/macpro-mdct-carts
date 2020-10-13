import hashlib
from django.core.cache import caches  # type: ignore
from django.utils.encoding import force_text, force_bytes  # type: ignore


def cache_key(f, *args, **kwargs):
    cache_k = ":".join(
        [force_text(x) for x in args]
        + [force_text(f"{k}={v}") for k, v in kwargs.items()]
    )
    return hashlib.md5(force_bytes(f.__name__ + cache_k)).hexdigest()


def cached(location, timeout):
    def inner(func):
        def wrapper(*args, **kwargs):
            cache = caches[location]
            key = cache_key(func, *args, **kwargs)

            if rv := cache.get(key):
                print(f"cache hit for {key}")
                return rv

            print(f"cache miss for {key}")
            rv = func(*args, **kwargs)
            cache.set(key, rv, timeout)
            return rv

        return wrapper

    return inner
