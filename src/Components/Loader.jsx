import React from 'react'
import { Loader, Skeleton } from '@mantine/core';

export const SkeletonLoader = () => {
	return (
		<>
			<Skeleton height={8} mt={8} width="90%" />
			<Skeleton height={8} mt={6} width="90%" />
			<Skeleton height={8} mt={6} width="90%" />
			<Skeleton height={8} mt={8} width="90%" />
			<Skeleton height={8} mt={6} width="90%" />
		</>
	)
}

export const OvalLoader = () => {
	return (
		<>
		<Loader size="xl" />
		</>
	)
}