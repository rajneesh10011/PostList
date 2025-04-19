import {
  ActivityIndicator,
  Animated,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useCallback, useEffect, useRef, useState} from 'react';

import {Header, MyStatusBar, PostCard, Spacer} from '../components';
import {clearPosts, getPosts} from '../slices/postSlice';
import {useDispatch, useSelector} from 'react-redux';
import {fontFamily, colors} from '../constant';

const RenderPosts = React.memo(({item}) => {
  const {id, image, title, body} = item;
  const translateY = useRef(new Animated.Value(20)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View style={{transform: [{translateY}], opacity}}>
      <PostCard id={id} imageUrl={image} title={title} description={body} />
    </Animated.View>
  );
});

const Dashboard = () => {
  const dispatch = useDispatch();
  const {posts, page, total} = useSelector(state => state.postSlice);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchInitialPosts();
  }, []);

  const fetchInitialPosts = () => {
    dispatch(
      getPosts({
        limit: 5,
        page: 0,
        onRequest: () => setLoading(true),
        onSuccess: () => setLoading(false),
        onFail: err => {
          setLoading(false);
          setError(err);
        },
      }),
    );
  };

  const loadMorePosts = useCallback(() => {
    if (!loading && !loadingMore && posts.length < total) {
      dispatch(
        getPosts({
          limit: 5,
          onRequest: () => setLoadingMore(true),
          onSuccess: () => setLoadingMore(false),
          onFail: err => {
            setLoadingMore(false);
            setError(err);
          },
        }),
      );
    }
  }, [loading, loadingMore, posts.length, total]);

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    dispatch(clearPosts());
    dispatch(
      getPosts({
        limit: 5,
        page: 0,
        onRequest: () => {},
        onSuccess: () => setRefreshing(false),
        onFail: err => {
          setRefreshing(false);
          setError(err);
        },
      }),
    );
  }, []);

  const renderItem = useCallback(({item}) => {
    return <RenderPosts item={item} />;
  }, []);

  const renderListFooter = useCallback(() => {
    if (loadingMore) {
      return (
        <View style={styles.footer}>
          <ActivityIndicator size="small" color={colors.loader} />
        </View>
      );
    }
    if (posts.length >= total) {
      return (
        <View style={styles.footer}>
          <Text style={styles.footerText}>No more posts to load</Text>
        </View>
      );
    }
    return null;
  }, [loadingMore, posts.length, total]);

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color={colors.loader} />
      </View>
    );
  }

  if (error && posts.length === 0) {
    return (
      <View style={styles.loader}>
        <Text style={styles.error}>Unable to fetch posts</Text>
        <Spacer height={10} />
        <TouchableOpacity onPress={fetchInitialPosts}>
          <Text style={styles.retry}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <>
      <MyStatusBar backgroundColor={colors.primary} barStyle="default" />
      <SafeAreaView style={styles.container}>
        <Header title={'📝 Latest Posts'} />
        <Spacer height={20} />
        <Text style={styles.postListTitle}>Post List</Text>
        <Spacer height={10} />
        <Animated.FlatList
          data={posts}
          renderItem={renderItem}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          onEndReached={loadMorePosts}
          onEndReachedThreshold={0.5}
          refreshing={refreshing}
          onRefresh={handleRefresh}
          ListFooterComponent={renderListFooter}
          scrollEventThrottle={16}
          removeClippedSubviews
          initialNumToRender={8}
          maxToRenderPerBatch={8}
          windowSize={7}
          updateCellsBatchingPeriod={30}
        />
      </SafeAreaView>
    </>
  );
};

export default React.memo(Dashboard);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    width: '100%',
  },
  postListTitle: {
    fontSize: 18,
    color: colors.black,
    paddingHorizontal: 16,
    ...fontFamily.semiBold,
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 20,
    paddingVertical: 10,
  },
  loader: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  error: {
    fontSize: 16,
    color: colors.secondaryText,
    ...fontFamily.semiBold,
  },
  retry: {
    color: colors.blue,
    fontSize: 14,
    ...fontFamily.semiBold,
  },
  footer: {
    alignItems: 'center',
    marginVertical: 16,
  },
  footerText: {
    color: colors.secondaryText,
    fontSize: 14,
    ...fontFamily.regular,
  },
});
